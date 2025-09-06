import { AppBar } from "./components/appbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Users,
  ThumbsUp,
  Youtube,
  Heart,
  Play,
  Headphones,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <AppBar />
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted/30 transition-all duration-500">
        <div className="container mx-auto max-w-4xl">
          <Badge
            variant="secondary"
            className="mb-4 bg-accent/20 text-accent-foreground border-accent/30 transition-all duration-200 hover:bg-accent/30 cursor-pointer"
          >
            🎵 Social Music Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance transition-all duration-300">
            Share, Vote & Discover
            <span className="text-primary block">Music Together</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty transition-colors duration-300">
            Join the ultimate social music experience. Share your favorite
            YouTube tracks, vote on what's hot, and discover new music through
            community-driven playlists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Join the Movement
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-foreground text-foreground hover:bg-foreground hover:text-background cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg bg-transparent"
            >
              <Youtube className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 px-4 transition-all duration-500">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 transition-colors duration-300">
              Why Music Lovers Choose Muzer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto transition-colors duration-300">
              Experience music like never before with our innovative social
              features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group cursor-pointer hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Youtube className="w-8 h-8 text-primary transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl transition-colors duration-300">
                  YouTube Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center transition-colors duration-300">
                  Seamlessly share and discover YouTube music videos. Our smart
                  system extracts metadata and creates beautiful previews for
                  every track.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group cursor-pointer hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                  <ThumbsUp className="w-8 h-8 text-accent transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl transition-colors duration-300">
                  Social Voting System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center transition-colors duration-300">
                  Vote on tracks to help the community discover the best music.
                  Our democratic system ensures quality content rises to the
                  top.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group cursor-pointer hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-all duration-300 group-hover:scale-110">
                  <Users className="w-8 h-8 text-secondary transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl transition-colors duration-300">
                  Community Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center transition-colors duration-300">
                  Connect with fellow music enthusiasts. Build your reputation,
                  follow favorite curators, and be part of a vibrant music
                  community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 transition-all duration-500">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 transition-colors duration-300">
              How Muzer Works
            </h2>
            <p className="text-lg text-muted-foreground transition-colors duration-300">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 transition-colors duration-300">
                Sign Up
              </h3>
              <p className="text-muted-foreground transition-colors duration-300">
                Create your account with Google authentication in seconds
              </p>
            </div>
            <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-accent-foreground font-bold text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 transition-colors duration-300">
                Share Music
              </h3>
              <p className="text-muted-foreground transition-colors duration-300">
                Paste YouTube links to share your favorite tracks with the
                community
              </p>
            </div>
            <div className="text-center transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-secondary-foreground font-bold text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 transition-colors duration-300">
                Vote & Discover
              </h3>
              <p className="text-muted-foreground transition-colors duration-300">
                Vote on tracks and discover new music through community
                recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="community"
        className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5 transition-all duration-500"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 transition-colors duration-300">
            Ready to Join the Music Revolution?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto transition-colors duration-300">
            Be part of a community that's reshaping how we discover and share
            music. Your next favorite song is just a vote away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Headphones className="w-5 h-5 mr-2" />
              Start Sharing Music
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 bg-transparent cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Explore Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card/50 transition-all duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 cursor-pointer transition-transform duration-200 hover:scale-105">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Music className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Muzer</span>
              </div>
              <p className="text-muted-foreground transition-colors duration-300">
                The social music platform that brings people together through
                the power of music.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 transition-colors duration-300">
                Product
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 transition-colors duration-300">
                Community
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 transition-colors duration-300">
                Support
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 cursor-pointer"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground transition-colors duration-300">
            <p>&copy; 2024 Muzer. Built with ❤️ for music lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
