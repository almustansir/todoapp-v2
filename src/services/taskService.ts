import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const COLLECTION_NAME = "tasks";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: boolean;
  userId: string;
  createdAt: any;
}

// 1. Add Task
export const addTask = async (
  userId: string,
  title: string,
  description: string = "",
) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    userId,
    title,
    description,
    status: false,
    createdAt: serverTimestamp(),
  });
};

// 2. Toggle Status
export const toggleTaskStatus = async (
  taskId: string,
  currentStatus: boolean,
) => {
  const taskRef = doc(db, COLLECTION_NAME, taskId);
  return await updateDoc(taskRef, { status: !currentStatus });
};

// 3. Update Task Details
export const updateTask = async (
  taskId: string,
  title: string,
  description: string,
) => {
  const taskRef = doc(db, "tasks", taskId);
  return await updateDoc(taskRef, {
    title,
    description,
    updatedAt: serverTimestamp(), // Optional: track when it was edited
  });
};

// 4. Delete Task
export const deleteTask = async (taskId: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME, taskId));
};
