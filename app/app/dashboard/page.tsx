"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { ChevronUp, ChevronDown, Play, Plus, Music, LogOut, User, Share2, Loader2 } from "lucide-react"
import { toast } from "../../components/ui/use-toast"

interface Song {
  id: string
  title: string
  thumbnail: string
  videoId: string
  votes: number
  userVote?: "up" | "down" | null
}

// Mock data for demonstration
const mockQueue: Song[] = [
  {
    id: "1",
    title: "Bohemian Rhapsody - Queen",
    thumbnail: "/bohemian-rhapsody-queen-album-cover.jpg",
    videoId: "fJ9rUzIMcZQ",
    votes: 15,
    userVote: null,
  },
  {
    id: "2",
    title: "Stairway to Heaven - Led Zeppelin",
    thumbnail: "/led-zeppelin-stairway-to-heaven-album-cover.jpg",
    videoId: "QkF3oxziUI4",
    votes: 12,
    userVote: "up",
  },
  {
    id: "3",
    title: "Hotel California - Eagles",
    thumbnail: "/eagles-hotel-california-album-cover.jpg",
    videoId: "BciS5krYL80",
    votes: 8,
    userVote: null,
  },
]



export default function MusicVotingApp() {
  const { data: session, status } = useSession()
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [queue, setQueue] = useState<Song[]>([])
  const [sortedQueue, setSortedQueue] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)

  // Fetch queue from backend
  const fetchQueue = async () => {
    setLoading(true)
    try {
      // Use the mystreams endpoint to get the user's streams
      const res = await axios.get("/api/streams/mystreams")
      // Map backend data to Song interface
      setQueue(
        res.data.streams.map((stream: any) => ({
          id: stream.id,
          title: stream.title,
          thumbnail: stream.smallImg,
          videoId: stream.extractedId,
          votes: stream.upvotes || 0,
          userVote: stream.upvotes && stream.upvotes.length > 0 ? "up" : null,
        }))
      )
    } catch (e: unknown) {
      console.error("Error fetching streams:", e)
      // Type guard for axios error response
      if (e && typeof e === 'object' && 'response' in e) {
        const axiosError = e as { response: { data: any; status: number } };
        console.error("Response data:", axiosError.response.data);
        console.error("Response status:", axiosError.response.status);
      }
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to fetch song queue",
        variant: "destructive"
      });
    }
    setLoading(false)
  }

  useEffect(() => {
    if (status === "authenticated") fetchQueue()
  }, [status])

  useEffect(() => {
    setSortedQueue([...queue].sort((a, b) => b.votes - a.votes));
  }, [queue]);

  useEffect(() => {
    if (sortedQueue.length > 0 && !currentSong) {
      setCurrentSong(sortedQueue[0])
    }
  }, [sortedQueue, currentSong])

  const extractVideoId = (url: string): string | null => {
    console.log("Extracting video ID from URL:", url)
    
    if (!url) {
      console.log("URL is empty")
      return null
    }
    
    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split(/[?&#]/)[0]
      console.log("Extracted ID (youtu.be format):", id)
      return id || null
    }
    
    // Handle youtube.com format
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url)
      const id = urlObj.searchParams.get('v')
      console.log("Extracted ID (youtube.com format):", id)
      return id
    }
    
    // Handle youtube.com/embed format
    if (url.includes('youtube.com/embed/')) {
      const id = url.split('youtube.com/embed/')[1]?.split(/[?&#]/)[0]
      console.log("Extracted ID (embed format):", id)
      return id || null
    }
    
    // Fallback to regex
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    console.log("Regex extraction result:", match ? match[1] : null)
    return match ? match[1] : null
  }

  const handleUrlChange = (url: string) => {
    setYoutubeUrl(url)
    const videoId = extractVideoId(url)
    setPreviewVideo(videoId)
  }

  const handleSubmitSong = async () => {
    console.log("Submit button clicked", { previewVideo, submitting, sessionId: session?.user?.id })
    
    if (!previewVideo) {
      console.error("No preview video available")
      return
    }
    
    if (submitting) {
      console.error("Already submitting")
      return
    }
    
    if (!session?.user?.id) {
      console.error("No user ID available")
      toast({
        title: "Error",
        description: "You must be logged in to submit a song",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      console.log("Sending request to backend", { url: youtubeUrl })
      
      // Send the video to the backend - only send URL, backend will use authenticated user
      const response = await axios.post("/api/streams", {
        url: youtubeUrl
      })
      
      console.log("Response from backend:", response.data)
      
      // Refresh the queue
      await fetchQueue()
      
      // Reset form
      setYoutubeUrl("")
      setPreviewVideo(null)
    } catch (e: unknown) {
      console.error("Error submitting song:", e)
      // Type guard for axios error response
      if (e && typeof e === 'object' && 'response' in e) {
        const axiosError = e as { response: { data: any; status: number } };
        toast({
          title: "Error submitting song",
          description: axiosError.response.data?.message || "Something went wrong",
          variant: "destructive"
        });
        console.error("Response data:", axiosError.response.data)
        console.error("Response status:", axiosError.response.status)
      }
    }
    setSubmitting(false)
  }

  // Vote for a song
  const handleVote = async (songId: string, voteType: "up" | "down") => {
    if (!session?.user?.id) return;
    try {
      // Send vote to backend
      await axios.post("/api/streams/vote", {
        streamId: songId,
        type: voteType  // Changed from voteType to type to match API expectation
      });
      
      // Refresh the queue to get updated vote counts
      await fetchQueue();
    } catch (e: unknown) {
      console.error("Error voting for song:", e);
      // Type guard for axios error response
      if (e && typeof e === 'object' && 'response' in e) {
        const axiosError = e as { response: { data: any; status: number } };
        console.error("Response data:", axiosError.response.data);
        console.error("Response status:", axiosError.response.status);
      }
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to vote for song",
        variant: "destructive"
      });
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href
    const shareText = "Join my music voting session! Vote for the next song to be played on stream."

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Music Voting Session",
          text: shareText,
          url: shareUrl,
        })
      } catch (error: unknown) {
        console.log("Share cancelled", error)
        toast({
          title: "Share failed",
          description: "Could not share the session link",
          variant: "destructive"
        })
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      toast({
        title: "Link copied",
        description: "Session link copied to clipboard"
      })
    }
  }



  // Show loading state if session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <p>Loading your music queue...</p>
        </div>
      </div>
    )
  }

  // Show sign in message if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
          <p className="mb-6">Please sign in to access your music queue</p>
          <Button asChild>
            <a href="/api/auth/signin">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8 p-4 bg-black rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold">Creator Dashboard</h1>
              <p className="text-slate-400 text-sm">Manage your stream's music queue</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-slate-700 hover:bg-slate-800 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={session?.user?.image || "/creator-profile.png"} />
                <AvatarFallback className="bg-purple-600 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="font-medium text-sm">{session?.user?.name || "StreamerName"}</p>
                <p className="text-slate-400 text-xs">Creator</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 bg-transparent" asChild>
              <a href="/api/auth/signout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </a>
            </Button>
          </div>
        </header>

        <div className="space-y-6">
          {/* Submit Song Section */}
          <Card className="bg-black border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Plus className="h-5 w-5 text-purple-400" />
                Submit a Song
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>

              {previewVideo && (
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${previewVideo}`}
                    className="w-full h-full"
                    allowFullScreen
                    title="Preview"
                  />
                </div>
              )}

              <Button
                onClick={handleSubmitSong}
                disabled={!previewVideo || submitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Add to Queue"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Now Playing Section */}
          <Card className="bg-black border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Play className="h-5 w-5 text-orange-400" />
                Now Playing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentSong ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-800 mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1`}
                    className="w-full h-full"
                    allowFullScreen
                    title="Current Song"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-800 mb-4 flex items-center justify-center text-slate-400">
                  No song currently playing.
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg text-balance text-white mb-2">
                  {currentSong ? currentSong.title : "No song playing"}
                </h3>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
                    {currentSong ? currentSong.votes : 0} votes
                  </Badge>
                  <div className="flex gap-1">
                    {currentSong && (
                      <>
                        <Button
                          size="sm"
                          variant={currentSong.userVote === "up" ? "default" : "outline"}
                          onClick={() => {
                            /* Handle current song vote */
                          }}
                          className={
                            currentSong.userVote === "up"
                              ? "bg-green-600 hover:bg-green-700"
                              : "border-slate-700 hover:bg-slate-800 text-slate-300"
                          }
                        >
                          <ChevronUp className="h-4 w-4 mr-1" />
                          {currentSong.userVote === "up" ? "Upvoted" : "Upvote"}
                        </Button>
                        <Button
                          size="sm"
                          variant={currentSong.userVote === "down" ? "destructive" : "outline"}
                          onClick={() => {
                            /* Handle current song vote */
                          }}
                          className={
                            currentSong.userVote === "down"
                              ? "bg-red-600 hover:bg-red-700"
                              : "border-slate-700 hover:bg-slate-800 text-slate-300"
                          }
                        >
                          <ChevronDown className="h-4 w-4 mr-1" />
                          {currentSong.userVote === "down" ? "Downvoted" : "Downvote"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      if (sortedQueue.length > 0 && currentSong) {
                        const currentIndex = sortedQueue.findIndex(song => song.id === currentSong.id);
                        const prevIndex = (currentIndex - 1 + sortedQueue.length) % sortedQueue.length;
                        setCurrentSong(sortedQueue[prevIndex]);
                      }
                    }}
                    disabled={sortedQueue.length === 0}
                  >
                    Play Previous
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      if (sortedQueue.length > 0 && currentSong) {
                        const currentIndex = sortedQueue.findIndex(song => song.id === currentSong.id);
                        const nextIndex = (currentIndex + 1) % sortedQueue.length;
                        setCurrentSong(sortedQueue[nextIndex]);
                      }
                    }}
                    disabled={sortedQueue.length === 0}
                  >
                    Play Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queue Section */}
          <Card className="bg-black border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Queue ({sortedQueue.length} songs)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-slate-400">
                  <Loader2 className="h-12 w-12 mx-auto mb-3 opacity-50 animate-spin" />
                  <p>Loading songs...</p>
                </div>
              ) : sortedQueue.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-sm font-medium text-slate-300">
                    {index + 1}
                  </div>

                  <img
                    src={song.thumbnail || "/placeholder.svg"}
                    alt={song.title}
                    className="w-16 h-12 rounded object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-white">{song.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                        {song.votes} votes
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant={song.userVote === "up" ? "default" : "outline"}
                      onClick={() => handleVote(song.id, "up")}
                      className={`h-8 w-8 p-0 ${
                        song.userVote === "up"
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-slate-700 hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={song.userVote === "down" ? "destructive" : "outline"}
                      onClick={() => handleVote(song.id, "down")}
                      className={`h-8 w-8 p-0 ${
                        song.userVote === "down"
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-slate-700 hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      onClick={() => setCurrentSong(song)}
                      className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                    >
                      Play Now
                    </Button>
                  </div>
                </div>
              ))}

              {!loading && sortedQueue.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No songs in queue yet</p>
                  <p className="text-sm">Submit the first song!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
