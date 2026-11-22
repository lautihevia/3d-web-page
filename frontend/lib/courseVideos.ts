export interface CourseVideo {
  id: number;
  youtubeId: string;
  url: string;
  thumbnailUrl: string;
  label?: string | null;
  title: string;
  description?: string | null;
  sortOrder: number;
  active: boolean;
}

export const CHANNEL_URL = "https://www.youtube.com/@3Dencasa";

export async function fetchCourseVideos(apiUrl: string): Promise<CourseVideo[]> {
  try {
    const res = await fetch(`${apiUrl}/api/v1/course-videos`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
