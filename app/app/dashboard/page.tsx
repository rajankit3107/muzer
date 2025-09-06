"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  Plus,
  Search,
  Home,
  User,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Music,
  Clock,
  Users,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock data for demonstration
const mockStreams = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    thumbnail: "app/public/eagles-hotel-california-album.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    upvotes: 142,
    downvotes: 8,
    duration: "5:55",
    addedBy: "John Doe",
    isPlaying: false,
  },
  {
    id: "2",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/watch?v=QkF3oxziUI4",
    upvotes: 98,
    downvotes: 3,
    duration: "8:02",
    addedBy: "Jane Smith",
    isPlaying: true,
  },
  {
    id: "3",
    title: "Hotel California",
    artist: "Eagles",
    thumbnail: "/eagles-hotel-california-album.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=09839DpTctU",
    upvotes: 87,
    downvotes: 12,
    duration: "6:30",
    addedBy: "Mike Johnson",
    isPlaying: false,
  },
];

const trendingStreams = [
  {
    id: "4",
    title: "Blinding Lights",
    artist: "The Weeknd",
    thumbnail: "/the-weeknd-blinding-lights.jpg",
    upvotes: 234,
    trend: "+15%",
  },
  {
    id: "5",
    title: "Shape of You",
    artist: "Ed Sheeran",
    thumbnail: "/ed-sheeran-shape-of-you.jpg",
    upvotes: 189,
    trend: "+8%",
  },
];

export default function Dashboard() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState("2");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStreamModalOpen, setIsAddStreamModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  //session
  const session = useSession();
  const router = useRouter();

  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const currentStream = mockStreams.find(
    (stream) => stream.id === currentlyPlaying
  );

  const handleVote = (streamId: string, voteType: "up" | "down") => {
    // TODO: Implement voting logic with API calls
    console.log(`Voted ${voteType} on stream ${streamId}`);
  };

  const togglePlay = (streamId: string) => {
    setCurrentlyPlaying(currentlyPlaying === streamId ? "" : streamId);
  };

  const handleAddStream = () => {
    if (youtubeUrl.trim()) {
      // TODO: Implement API call to add stream
      console.log("Adding stream:", youtubeUrl);
      setYoutubeUrl("");
      setIsAddStreamModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-8">
          <Music className="h-8 w-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Muzer</h1>
        </div>

        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-900 bg-cyan-400 hover:bg-cyan-300 cursor-pointer"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-cyan-400 hover:bg-gray-800 cursor-pointer"
          >
            <User className="h-5 w-5" />
            Profile
          </Button>
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-cyan-400 hover:bg-gray-800 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="font-semibold text-white mb-2">Your Stats</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Total Upvotes</span>
              <span>89</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8 bg-gray-950 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-400">
              Discover and share amazing music with the community
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for music..."
                className="pl-10 w-80 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={() => setIsAddStreamModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stream
            </Button>
          </div>
        </div>

        {/* YouTube video player section */}
        {currentStream && (
          <Card className="mb-8 bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">
                    Now Playing
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gray-800 text-gray-300 border-gray-700"
                >
                  Live
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Player */}
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                  {getYouTubeVideoId(currentStream.youtubeUrl) ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                        currentStream.youtubeUrl
                      )}?autoplay=1`}
                      title={currentStream.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Music className="h-12 w-12" />
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {currentStream.title}
                  </h3>
                  <p className="text-lg text-gray-300 mb-4">
                    {currentStream.artist}
                  </p>

                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentStream.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Added by {currentStream.addedBy}
                    </span>
                  </div>

                  {/* Voting Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => handleVote(currentStream.id, "up")}
                    >
                      <ChevronUp className="h-4 w-4" />
                      {currentStream.upvotes}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => handleVote(currentStream.id, "down")}
                    >
                      <ChevronDown className="h-4 w-4" />
                      {currentStream.downvotes}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-gray-800 border-gray-700">
            <TabsTrigger
              value="queue"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-gray-300"
            >
              Queue
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-gray-300"
            >
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-gray-300"
            >
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Current Queue
              </h3>
              <Badge
                variant="secondary"
                className="bg-gray-800 text-gray-300 border-gray-700"
              >
                {mockStreams.length} tracks
              </Badge>
            </div>

            <div className="space-y-4">
              {mockStreams.map((stream) => (
                <Card
                  key={stream.id}
                  className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Album Art */}
                      <div className="relative">
                        <img
                          src={stream.thumbnail || "/placeholder.svg"}
                          alt={`${stream.title} cover`}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white opacity-0 hover:opacity-100 transition-opacity"
                          onClick={() => togglePlay(stream.id)}
                        >
                          {currentlyPlaying === stream.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Track Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-lg">
                          {stream.title}
                        </h4>
                        <p className="text-gray-300">{stream.artist}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {stream.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Added by {stream.addedBy}
                          </span>
                        </div>
                      </div>

                      {/* Voting Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => handleVote(stream.id, "up")}
                        >
                          <ChevronUp className="h-4 w-4" />
                          {stream.upvotes}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                          onClick={() => handleVote(stream.id, "down")}
                        >
                          <ChevronDown className="h-4 w-4" />
                          {stream.downvotes}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h3 className="text-xl font-semibold text-white">Trending Now</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingStreams.map((stream) => (
                <Card key={stream.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={stream.thumbnail || "/placeholder.svg"}
                        alt={`${stream.title} cover`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {stream.title}
                        </h4>
                        <p className="text-gray-300 text-sm">{stream.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="bg-gray-800 text-gray-300 border-gray-700 text-xs"
                          >
                            {stream.trend}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {stream.upvotes} votes
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Recently Added</h3>
            <div className="text-center py-12 text-gray-400">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent streams to show</p>
              <p className="text-sm">
                Start adding music to see your recent activity
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal for adding new stream */}
      <Dialog
        open={isAddStreamModalOpen}
        onOpenChange={setIsAddStreamModalOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Stream</DialogTitle>
            <DialogDescription className="text-gray-400">
              Paste a YouTube URL to add a new song to the queue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="youtube-url" className="text-right text-gray-300">
                YouTube URL
              </Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setIsAddStreamModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={handleAddStream}
              disabled={!youtubeUrl.trim()}
            >
              Add Stream
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
