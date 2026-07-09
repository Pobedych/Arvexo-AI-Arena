import { notFound } from "next/navigation";
import { lessons } from "@/lib/mockData";
import LessonView from "./LessonView";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((l) => l.id === Number(lessonId));
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
