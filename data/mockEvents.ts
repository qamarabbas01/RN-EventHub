export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  capacity: number;
  status: "upcoming" | "live" | "ended";
  imageUrl?: string;
  description?: string;
};

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2026",
    date: "Mar 15, 2026",
    time: "10:00 AM",
    location: "San Francisco Convention Center",
    attendees: 450,
    capacity: 500,
    status: "upcoming",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    description:
      "Join the leading minds in tech for a day of innovation, networking, and learning at the Tech Conference 2026.",
  },
  {
    id: "2",
    title: "Web Development Workshop",
    date: "Mar 12, 2026",
    time: "Live Now",
    location: "Online - Zoom",
    attendees: 120,
    capacity: 150,
    status: "live",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    description:
      "A hands-on workshop for web developers to learn the latest in frontend and backend technologies.",
  },
  {
    id: "3",
    title: "Design Thinking Bootcamp",
    date: "Mar 08, 2026",
    time: "09:00 AM",
    location: "New York Creative Hub",
    attendees: 85,
    capacity: 100,
    status: "ended",
    imageUrl:
      "https://event-manager-three-eta.vercel.app/_app/immutable/assets/music.DareFaYV.png",
    description:
      "Unlock your creativity and problem-solving skills in this immersive design thinking bootcamp.",
  },
  {
    id: "4",
    title: "AI & Machine Learning Summit",
    date: "Mar 22, 2026",
    time: "11:30 AM",
    location: "Boston Tech Park",
    attendees: 320,
    capacity: 400,
    status: "upcoming",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    description:
      "Dive deep into the world of AI and machine learning with industry leaders and experts.",
  },
  {
    id: "5",
    title: "Startup Networking Night",
    date: "Mar 18, 2026",
    time: "06:00 PM",
    location: "Downtown Lounge, Chicago",
    attendees: 95,
    capacity: 150,
    status: "upcoming",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    description:
      "Meet fellow entrepreneurs, investors, and mentors at this exclusive networking night.",
  },
];
