import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy, Edit, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const promptLibrary = {
  Nature: [
    "A majestic waterfall cascading through lush green rainforest, golden hour lighting, misty atmosphere, ultra high resolution, cinematic style",
    "A serene mountain lake reflecting snow-capped peaks at sunset, vibrant orange and pink sky, pristine clarity, professional landscape photography",
    "A vast field of lavender swaying in gentle breeze, soft purple hues, warm afternoon sunlight, dreamy bokeh effect, ultra detailed",
    "An ancient redwood forest with sun rays piercing through morning fog, mystical atmosphere, rich green tones, nature photography masterpiece",
    "A dramatic lightning storm over rolling plains, dark storm clouds, electric blue bolts, high contrast, award-winning weather photography",
    "A peaceful bamboo forest with dappled sunlight, zen atmosphere, fresh green colors, soft focus background, tranquil scene",
    "A pristine coral reef teeming with colorful fish, crystal clear turquoise water, underwater photography, vibrant marine life, ultra sharp",
    "A golden wheat field under dramatic sunset sky, warm amber tones, soft wind motion, rustic countryside, cinematic lighting",
    "A frozen waterfall in winter wonderland, icicles glistening, snow-covered landscape, cold blue tones, magical winter scene",
    "A desert oasis with palm trees at twilight, deep blue sky transitioning to orange, peaceful reflection in water, ultra realistic",
  ],
  Portrait: [
    "A confident businesswoman in modern office, professional attire, natural window lighting, sharp focus on eyes, corporate photography style",
    "An elderly man with weathered face telling stories, warm candlelight, deep wrinkles showing character, emotional portrait, Rembrandt lighting",
    "A young dancer mid-leap in studio, graceful pose, dramatic side lighting, frozen motion, professional dance photography, ultra high resolution",
    "A happy family laughing together outdoors, golden hour sunlight, genuine emotions, lifestyle photography, soft natural colors",
    "A mysterious woman in vintage clothing, film noir style, black and white, dramatic shadows, classic Hollywood glamour",
    "A child's wonder-filled face discovering something magical, soft natural light, innocent expression, candid moment, heartwarming portrait",
    "A powerful athlete in intense training moment, dramatic gym lighting, determination in eyes, sweat details, sports photography excellence",
    "An artist in their creative studio surrounded by work, natural daylight, contemplative mood, environmental portrait, authentic moment",
    "A bride in elegant wedding dress, soft romantic lighting, dreamy bokeh background, timeless beauty, luxury wedding photography",
    "A musician lost in performance moment, stage lighting, passionate expression, dynamic composition, concert photography style",
  ],
  Fantasy: [
    "A ethereal fairy with glowing wings in enchanted forest, magical particles floating, bioluminescent plants, fantasy art masterpiece, ultra detailed",
    "A mighty dragon soaring above medieval castle, epic scale, dramatic clouds, fire breath effects, fantasy illustration, cinematic lighting",
    "An ancient wizard casting powerful spell in tower, mystical energy swirls, arcane symbols glowing, dark sorcerer aesthetic, high fantasy art",
    "A beautiful mermaid swimming through underwater ruins, shimmering scales, sun rays penetrating water, fantasy realism, ethereal atmosphere",
    "A warrior knight battling mythical beast, dynamic action pose, magical weapon effects, epic battle scene, fantasy game art style",
    "An elven archer in moonlit forest, elegant armor, bow drawn, mystical moonlight, high fantasy character design, photorealistic",
    "A floating sky island with waterfalls cascading into clouds, impossible architecture, magical crystals, Studio Ghibli inspired, dreamlike quality",
    "A phoenix rising from flames, vibrant fire colors, powerful wings spread, mythological creature, dramatic rebirth moment, ultra realistic",
    "An enchanted library with floating books and glowing runes, magical atmosphere, endless shelves, wizard's sanctuary, fantasy interior",
    "A fairy tale castle in clouds at sunset, impossible towers, rainbow bridge, magical kingdom, whimsical architecture, dreamscape painting",
  ],
  Urban: [
    "A neon-lit cyberpunk street at night, futuristic cityscape, rain-slicked pavement reflecting lights, blade runner aesthetic, ultra detailed",
    "A bustling morning market in Asian city, vibrant colors, street food vendors, authentic cultural scene, documentary photography style",
    "An empty subway platform at midnight, moody atmospheric lighting, urban solitude, cinematic composition, film noir aesthetic",
    "A rooftop view of Manhattan skyline at golden hour, skyscrapers bathed in warm light, architectural photography, ultra high resolution",
    "A graffiti-covered alley with street art masterpieces, urban culture, vibrant spray paint colors, hip-hop aesthetic, wide angle shot",
    "A modern glass office building reflecting sunset clouds, architectural marvel, geometric patterns, contemporary design, professional photography",
    "A vintage diner at night with neon signs, Americana aesthetic, warm interior glow, nostalgic atmosphere, retro photography style",
    "A busy intersection in Tokyo with crossing crowds, motion blur, neon advertisements, urban energy, dynamic street photography",
    "An abandoned industrial warehouse with dramatic light shafts, urban decay, atmospheric dust particles, gritty realism, moody tones",
    "A luxury penthouse interior overlooking city lights at night, modern minimalist design, floor-to-ceiling windows, architectural digest style",
  ],
  Abstract: [
    "Flowing liquid metallic shapes in zero gravity, chrome reflections, colorful gradients, digital art, 8K resolution, smooth surfaces",
    "Geometric fractals spiraling infinitely, psychedelic colors, mathematical precision, trippy visuals, ultra detailed patterns",
    "Smoke and ink mixing underwater, fluid dynamics, black background, ethereal wisps, macro photography, mesmerizing motion",
    "Crystalline structures refracting rainbow light, prismatic effects, sharp geometric forms, glass art photography, ultra macro detail",
    "Digital glitch art with data corruption aesthetics, vibrant neon colors, cyberpunk vibe, modern abstract, technological decay",
    "Watercolor paint explosions on wet canvas, organic color bleeding, artistic chaos, vibrant pigments, macro photography",
    "Sacred geometry mandala with intricate patterns, spiritual symbols, perfect symmetry, golden ratio, meditation art, ultra detailed",
    "Light painting long exposure trails, vibrant color streaks in darkness, creative photography, mesmerizing motion paths",
    "Macro close-up of soap bubble surface, rainbow iridescence, delicate texture, scientific beauty, ultra high resolution detail",
    "Particle system simulation, energy flow visualization, neon trails, dark background, digital art, futuristic abstract",
  ],
  Animals: [
    "A majestic lion with golden mane backlit by sunset, powerful stance, African savanna, wildlife photography masterpiece, ultra sharp focus",
    "A colorful hummingbird frozen mid-flight sipping nectar, iridescent feathers, macro wildlife photography, perfect timing, ultra detailed",
    "A wise old elephant with tusks in natural habitat, gentle giant, emotional depth in eyes, conservation photography, dramatic lighting",
    "A leaping dolphin breaking ocean surface, water droplets frozen, dynamic motion, marine wildlife, perfect blue background, ultra high speed capture",
    "A snow leopard prowling on mountain ridge, camouflaged coat, intense predator gaze, rare wildlife moment, professional nature photography",
    "A vibrant tropical parrot in rainforest canopy, brilliant plumage colors, natural environment, bird photography excellence, vivid details",
    "A wolf pack howling under full moon, dramatic nighttime scene, wild nature, atmospheric mist, epic wildlife composition",
    "A curious baby panda munching bamboo, adorable expression, soft fur texture, natural habitat, conservation photography, heartwarming moment",
    "A magnificent peacock displaying full tail feathers, iridescent blue and green, mating display, ornithology photography, stunning natural beauty",
    "An underwater shot of great white shark approaching camera, powerful predator, clear blue ocean, thrilling wildlife encounter, professional dive photography",
  ],
  Technology: [
    "A futuristic AI robot with glowing circuits, sleek metallic design, neon blue accents, sci-fi technology, ultra realistic 3D render",
    "A holographic interface display floating in space, transparent screens, data visualization, cyberpunk aesthetic, glowing UI elements",
    "A quantum computer core with intricate circuitry, microscopic details, electrical energy flow, scientific photography, ultra macro detail",
    "A humanoid android with exposed mechanical parts, half human half machine, cybernetic enhancements, sci-fi character design, photorealistic",
    "A virtual reality user immersed in digital world, neon wireframe environment, floating data, matrix aesthetic, futuristic technology",
    "A sleek smartphone with edge-to-edge holographic display, product photography, minimalist design, premium tech aesthetic, studio lighting",
    "A server room with endless rows of glowing machines, data center atmosphere, blue LED indicators, technological infrastructure, wide angle",
    "A microchip circuit board extreme close-up, golden traces, electrical pathways, technology macro photography, ultra detailed components",
    "A autonomous drone hovering in flight, carbon fiber body, propeller motion blur, modern technology, clean background, product photography",
    "A neural network visualization with nodes and connections, artificial intelligence concept, glowing data points, futuristic digital art",
  ],
};

export const ReadyMadePromptsTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [displayedPrompts, setDisplayedPrompts] = useState<string[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const prompts = promptLibrary[category as keyof typeof promptLibrary];
    setDisplayedPrompts(prompts);
  };

  const handleRefresh = () => {
    if (!selectedCategory) return;
    
    const prompts = promptLibrary[selectedCategory as keyof typeof promptLibrary];
    const shuffled = [...prompts].sort(() => Math.random() - 0.5);
    setDisplayedPrompts(shuffled);
    
    toast({
      title: "Refreshed!",
      description: "Prompts have been shuffled",
    });
  };

  const handleCopy = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
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

  const handleEdit = (prompt: string) => {
    setEditingPrompt(prompt);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    await handleCopy(editingPrompt);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(promptLibrary).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={!selectedCategory}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Shuffle Prompts
        </Button>
      </div>

      {displayedPrompts.length > 0 && (
        <div className="grid gap-4">
          {displayedPrompts.map((prompt, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed">{prompt}</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleCopy(prompt)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Dialog open={isEditDialogOpen && editingPrompt === prompt} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleEdit(prompt)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Prompt</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          value={editingPrompt}
                          onChange={(e) => setEditingPrompt(e.target.value)}
                          className="min-h-[150px]"
                        />
                        <Button onClick={handleSaveEdit} className="w-full">
                          Copy Edited Prompt
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!selectedCategory && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Select a category to view ready-made prompts</p>
        </div>
      )}
    </div>
  );
};
