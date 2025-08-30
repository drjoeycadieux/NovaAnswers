'use server';

import { generateAnswer } from '@/ai/flows/generate-answer';
import { displaySourceAttributions } from '@/ai/flows/display-source-attributions';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const AskQuestionSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters long.' }),
});

export interface FormState {
  attributedAnswer?: string;
  sources?: string[];
  question?: string;
  error?: string;
  history?: ChatHistoryItem[];
}

export interface ChatHistoryItem {
    id: string;
    question: string;
    answer: string;
    sources: string[];
    createdAt: Date;
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function askQuestionAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = AskQuestionSchema.safeParse({
    question: formData.get('question'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.question?.join(', '),
    };
  }
  
  const { question } = validatedFields.data;

  try {
    const answerResult = await generateAnswer({ question });
    
    if (!answerResult || !answerResult.answer) {
      return { question, error: 'Could not generate an answer. Please try again.' };
    }

    const attributionResult = await displaySourceAttributions({
      question: question,
      answer: answerResult.answer,
    });
    
    const finalAnswer = attributionResult?.attributedAnswer || answerResult.answer;
    const finalSources = (answerResult.sources || []).concat(attributionResult?.sources || []);

    const user = auth.currentUser;
    if (user) {
        await addDoc(collection(db, 'users', user.uid, 'chats'), {
            question,
            answer: finalAnswer,
            sources: finalSources,
            createdAt: serverTimestamp(),
        });
    }

    return {
      question,
      attributedAnswer: finalAnswer,
      sources: finalSources,
    };
  } catch (e) {
    console.error(e);
    return {
      question,
      error: 'An unexpected error occurred. Please check your connection or try again later.',
    };
  }
}

export async function loginAction(previousState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }
  try {
    await signInWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect('/');
}

export async function signupAction(previousState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }
  try {
    await createUserWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
  } catch (e: any) {
    return { error: e.message };
  }
  redirect('/');
}

export async function logoutAction() {
  await signOut(auth);
  redirect('/');
}
