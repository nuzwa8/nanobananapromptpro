import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, RotateCcw, Shuffle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const AIGeneratorTab = () => {
  const [topic, setTopic] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [useFramework, setUseFramework] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const { toast } = useToast();

  // Framework state
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [action, setAction] = useState("");
  const [mood, setMood] = useState("");
  const [camera, setCamera] = useState("");
  const [objects, setObjects] = useState("");
  const [environment, setEnvironment] = useState("");
  const [resolution, setResolution] = useState("");
  const [artistic, setArtistic] = useState("");
  const [livePrompt, setLivePrompt] = useState("");

  const frameworkOptions = {
    position: ["Front view", "Side profile", "Back view", "3/4 angle", "Bird's eye view", "Worm's eye view"],
    role: ["Professional", "Casual", "Hero", "Villain", "Anonymous person", "Supporting character"],
    action: ["Walking", "Running", "Jumping", "Dancing", "Fighting", "Working", "Smiling", "Serious", "Surprised"],
    mood: ["Happy", "Melancholic", "Mysterious", "Energetic", "Peaceful", "Intense"],
    camera: ["DSLR", "Smartphone", "Wide angle", "Telephoto", "Portrait lens", "Shallow depth of field"],
    objects: ["Tools", "Technology", "Natural elements", "Daily items", "Props", "Weapons"],
    environment: ["Indoor", "Outdoor", "Urban", "Natural", "Studio", "Forest", "Beach", "City"],
    resolution: ["HD", "4K", "Highly detailed", "Sharp focus", "Print quality"],
    artistic: ["Photorealistic", "Digital art", "Painting style", "Black & white", "Vibrant colors", "Vintage filter"]
  };

  const proCamera = [
    { letter: "P", word: "Perspective", description: "Camera angle or point of view" },
    { letter: "R", word: "Resolution", description: "Image quality and detail level" },
    { letter: "O", word: "Objects", description: "Main subjects and elements" },
    { letter: "C", word: "Colors", description: "Color palette and mood" },
    { letter: "A", word: "Atmosphere", description: "Lighting and ambiance" },
    { letter: "M", word: "Medium", description: "Art style or technique" },
    { letter: "E", word: "Effects", description: "Special visual effects" },
    { letter: "R", word: "Realism", description: "Level of photorealism" },
    { letter: "A", word: "Aesthetic", description: "Overall visual style" },
  ];

  useEffect(() => {
    if (useFramework && position && role && action && mood && environment) {
      const parts = [];
      parts.push(`A ${position.toLowerCase()} ${role.toLowerCase()} ${action.toLowerCase()}`);
      parts.push(`in ${environment.toLowerCase()}`);
      parts.push(`${mood.toLowerCase()} mood`);
      if (camera) parts.push(`${camera.toLowerCase()} shot`);
      if (objects) parts.push(`with ${objects.toLowerCase()}`);
      if (artistic) parts.push(`${artistic.toLowerCase()} style`);
      if (resolution) parts.push(`${resolution.toLowerCase()}`);
      setLivePrompt(parts.join(", "));
    }
  }, [useFramework, position, role, action, mood, camera, objects, environment, resolution, artistic]);

  const handleRandomize = () => {
    setPosition(frameworkOptions.position[Math.floor(Math.random() * frameworkOptions.position.length)]);
    setRole(frameworkOptions.role[Math.floor(Math.random() * frameworkOptions.role.length)]);
    setAction(frameworkOptions.action[Math.floor(Math.random() * frameworkOptions.action.length)]);
    setMood(frameworkOptions.mood[Math.floor(Math.random() * frameworkOptions.mood.length)]);
    setCamera(frameworkOptions.camera[Math.floor(Math.random() * frameworkOptions.camera.length)]);
    setObjects(frameworkOptions.objects[Math.floor(Math.random() * frameworkOptions.objects.length)]);
    setEnvironment(frameworkOptions.environment[Math.floor(Math.random() * frameworkOptions.environment.length)]);
    setResolution(frameworkOptions.resolution[Math.floor(Math.random() * frameworkOptions.resolution.length)]);
    setArtistic(frameworkOptions.artistic[Math.floor(Math.random() * frameworkOptions.artistic.length)]);
  };

  const handleGenerate = async () => {
    const promptToUse = useFramework ? livePrompt : topic.trim();
    
    if (!promptToUse) {
      toast({
        title: "Error",
        description: useFramework ? "Please select options from the framework" : "Please enter an image idea first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: { topic: promptToUse }
      });

      if (error) throw error;

      if (data?.generatedPrompt) {
        const cleanedPrompt = data.generatedPrompt
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/#+\s*/g, '')
          .trim();
        
        setGeneratedPrompt(cleanedPrompt);
        toast({
          title: "Success",
          description: "AI-powered prompt generated successfully!",
        });
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate prompt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive",
      });
    }
  };

  const handleRegeneratePrompt = async () => {
    const promptToUse = useFramework ? livePrompt : topic.trim();
    
    if (!promptToUse) {
      toast({
        title: "Error",
        description: useFramework ? "Please select options from the framework" : "Please enter an image idea first",
        variant: "destructive",
      });
      return;
    }
    
    await handleGenerate();
  };

  const handleEnhancePrompt = async () => {
    if (!generatedPrompt) return;
    
    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: { topic: `Enhance this prompt to make it more detailed and vivid: ${generatedPrompt}` }
      });

      if (error) throw error;

      if (data?.generatedPrompt) {
        const cleanedPrompt = data.generatedPrompt
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/#+\s*/g, '')
          .trim();
        
        setGeneratedPrompt(cleanedPrompt);
        toast({
          title: "Enhanced!",
          description: "Prompt has been enhanced successfully",
        });
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      toast({
        title: "Error",
        description: "Failed to enhance prompt",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Framework Toggle */}
      <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg border">
        <div className="flex flex-col gap-1">
          <Label htmlFor="framework-toggle" className="text-base font-semibold">Use P.R.O C.A.M.E.R.A Framework</Label>
          <p className="text-xs text-muted-foreground">Structured prompt building with detailed options</p>
        </div>
        <Switch
          id="framework-toggle"
          checked={useFramework}
          onCheckedChange={setUseFramework}
        />
      </div>

      {/* Simple Input (When Framework is OFF) */}
      {!useFramework && (
        <div>
          <label className="block text-sm font-medium mb-2">Enter Your Image Idea</label>
          <Input
            placeholder="e.g., sunset over mountains"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="text-lg p-6"
          />
        </div>
      )}

      {/* Framework Interface (When Framework is ON) */}
      {useFramework && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* P - Position */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">P - Position / پوزیشن</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {frameworkOptions.position.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* R - Role */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">R - Role / کردار</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {frameworkOptions.role.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* A - Action */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">A - Action / ایکشن</Label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {frameworkOptions.action.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* M - Mood */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">M - Mood / ماحول</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {frameworkOptions.mood.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Section */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                {advancedOpen ? "Hide" : "Show"} Advanced Options (C.O.E.R.A)
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* C - Camera */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">C - Camera / کیمرا</Label>
                  <Select value={camera} onValueChange={setCamera}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworkOptions.camera.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* O - Objects */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">O - Objects / اشیاء</Label>
                  <Select value={objects} onValueChange={setObjects}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select objects" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworkOptions.objects.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* E - Environment */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">E - Environment / ماحولیاتی پس منظر</Label>
                  <Select value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworkOptions.environment.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* R - Resolution */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">R - Resolution / تیزی سے</Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworkOptions.resolution.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* A - Artistic */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium">A - Artistic / فنکارانہ</Label>
                  <Select value={artistic} onValueChange={setArtistic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select artistic style" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworkOptions.artistic.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Live Prompt Preview */}
          {livePrompt && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <Label className="text-xs font-semibold text-primary mb-2 block">Live Prompt Preview</Label>
              <p className="text-sm font-mono">{livePrompt}</p>
            </div>
          )}

          {/* Randomize Button */}
          <Button 
            onClick={handleRandomize} 
            variant="outline" 
            className="w-full"
            size="lg"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Randomize All Options
          </Button>
        </div>
      )}

      {/* Generate Button */}
      <Button 
        onClick={handleGenerate} 
        className="w-full" 
        size="lg"
        disabled={isLoading || (useFramework ? !livePrompt : !topic.trim())}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Prompt'
        )}
      </Button>

      {generatedPrompt && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="block text-sm font-medium">Generated Prompt (Ready to Copy)</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleCopyPrompt}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                onClick={handleEnhancePrompt}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isEnhancing}
              >
                <RotateCcw className="h-4 w-4" />
                {isEnhancing ? "Enhancing..." : "Enhance"}
              </Button>
              <Button
                onClick={handleRegeneratePrompt}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-primary/30 p-4">
            <Textarea
              value={generatedPrompt}
              readOnly
              className="min-h-[120px] text-base border-0 bg-transparent resize-none focus:ring-0 font-mono"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            ✨ Optimized and ready to use in any AI image generator
          </p>
        </div>
      )}

      {/* P.R.O C.A.M.E.R.A Framework Display */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center">P.R.O C.A.M.E.R.A Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proCamera.map((item, idx) => (
            <div key={idx} className="bg-secondary/50 rounded-lg p-4 border border-primary/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl font-bold text-primary">{item.letter}</span>
                <div>
                  <h4 className="font-semibold">{item.word}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
