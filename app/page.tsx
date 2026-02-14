"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUser();
  }, []);
  
  useEffect(() => {
    if(user) {
    fetchBookmarks();
    }
  }, [user]);

  useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel('bookmarks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        fetchBookmarks();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }

  async function fetchBookmarks() {
    if (!user) return;

    setLoading(true);

    const { data } = await supabase
      .from("bookmarks")
      .select("*")      
      .eq("user_id", user .id)      
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);

    setLoading(false);
  }

  async function addBookmark() {
    if (!user) return;

    if (!title || !url) {
      alert("Please fill all fields");
    }

    let formattedUrl = url;
    if (!url.startsWith("http")) {
      formattedUrl = "https://" + url;
    }

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url: formattedUrl,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.log("Supabase Error:", error);
      alert("error message");
    } else {
      await fetchBookmarks();
      setTitle("");
      setUrl("");

    }  
     
  }

  async function deleteBookmark(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this bookmark");
    if (!confirmDelete) return;

    const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

    if (error) {
      console.log("Delete Error :", error);
      alert(error.message);
    } else {
      await fetchBookmarks();

    }
    
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarks([]);
  }

   async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  useEffect(() => {
    getUser();

   const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null);
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Login with Google
      </button>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Smart Bookmark App</h1>

      {user && (
         <div className="flex items-center gap-4">
          <p className="text-sm-text-gray-400"> {user.email}</p>

          <button
            onClick={handleLogout}
           className="bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
           </button>
         </div>
       )}

      {/* Add Bookmark Form */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
        />
        <input
          type="text"
          placeholder="Bookmark URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      {/* Bookmark List */}
      <div className="space-y-4">

        {loading && ( <p
        className="text-gray-400">Loading bookmarks...</p>)}

        {!loading && bookmarks.length === 0 && (
          <p className="text-gray500 text-center">No bookmarks yet. Add your first one!</p>
        )}

        {!loading && 
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-gray-800 p-4 rounded flex justify-between items-centerhover:bg-gray-700 transition"
          >
            <div>
              <p className="font-bold">{bookmark.title}</p>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {bookmark.url}
              </a>
            </div>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}