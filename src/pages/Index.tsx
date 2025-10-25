import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIGeneratorTab } from "@/components/prompt-generator/AIGeneratorTab";
import { ReadyMadePromptsTab } from "@/components/prompt-generator/ReadyMadePromptsTab";
import { ConsistentCharacterTab } from "@/components/prompt-generator/ConsistentCharacterTab";

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Transform Ideas Into{" "}
          <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Perfect Image Prompts
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AI-powered CoachPro image prompt generator
        </p>
      </section>

      {/* Interactive Demo Section with Tabs */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto bg-card rounded-2xl border shadow-lg p-8">
          <Tabs defaultValue="ai-generator" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
              <TabsTrigger value="ready-made">Ready-Made Prompts</TabsTrigger>
              <TabsTrigger value="consistent-character">Consistent Character</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-generator">
              <AIGeneratorTab />
            </TabsContent>
            
            <TabsContent value="ready-made">
              <ReadyMadePromptsTab />
            </TabsContent>
            
            <TabsContent value="consistent-character">
              <ConsistentCharacterTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Use Our Generator</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "P.R.O C.A.M.E.R.A Framework", desc: "9-point formula for perfect prompts" },
            { title: "Instant Generation", desc: "Get professional prompts in seconds" },
            { title: "AI Optimized", desc: "Works with all major AI image tools" },
            { title: "Easy to Use", desc: "No technical knowledge needed" },
          ].map((feature, idx) => (
            <div key={idx} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>Â© 2025 AI Image Prompt Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
