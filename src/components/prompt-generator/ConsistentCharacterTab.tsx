import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, User, Copy } from "lucide-react";

interface Character {
  id: string;
  name: string;
  age: string;
  gender: string;
  hair: string;
  eyeColor: string;
  facialFeatures: string;
  clothingStyle: string;
  uniqueMarks: string;
}

const ACTIONS = [
  "walking", "running", "sitting", "jumping", "dancing", "fighting", "sleeping",
  "reading", "writing", "cooking", "eating", "thinking", "laughing", "crying",
  "standing", "kneeling", "climbing", "swimming", "flying", "driving", "painting"
];

const EXPRESSIONS = [
  "happy", "sad", "angry", "surprised", "calm", "excited", "worried",
  "confident", "shy", "mischievous", "serious"
];

const BACKGROUNDS = [
  "Studio", "Outdoor", "Indoor", "Forest", "Beach", "City", "Mountains",
  "Desert", "Snowy landscape", "Garden", "Street", "Office", "Home"
];

export const ConsistentCharacterTab = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [formData, setFormData] = useState<Partial<Character>>({
    name: "",
    age: "",
    gender: "",
    hair: "",
    eyeColor: "",
    facialFeatures: "",
    clothingStyle: "",
    uniqueMarks: "",
  });
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedExpression, setSelectedExpression] = useState<string>("");
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("consistentCharacters");
    if (saved) {
      try {
        setCharacters(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading characters:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (characters.length > 0) {
      localStorage.setItem("consistentCharacters", JSON.stringify(characters));
    }
  }, [characters]);

  const generateCharacterName = () => {
    const count = characters.length + 1;
    return `Character ${count}`;
  };

  const handleSaveCharacter = () => {
    if (characters.length >= 3) {
      toast({
        title: "Limit Reached",
        description: "Maximum 3 characters allowed. Delete one to add new.",
        variant: "destructive",
      });
      return;
    }

    const characterName = formData.name?.trim() || generateCharacterName();

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: characterName,
      age: formData.age || "",
      gender: formData.gender || "",
      hair: formData.hair || "",
      eyeColor: formData.eyeColor || "",
      facialFeatures: formData.facialFeatures || "",
      clothingStyle: formData.clothingStyle || "",
      uniqueMarks: formData.uniqueMarks || "",
    };

    setCharacters([...characters, newCharacter]);
    setFormData({
      name: "",
      age: "",
      gender: "",
      hair: "",
      eyeColor: "",
      facialFeatures: "",
      clothingStyle: "",
      uniqueMarks: "",
    });

    toast({
      title: "Character Saved!",
      description: `${characterName} has been saved successfully`,
    });
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(characters.filter((c) => c.id !== id));
    if (selectedCharacterId === id) {
      setSelectedCharacterId("");
    }
    toast({
      title: "Character Deleted",
      description: "Character has been removed",
    });
  };

  const handleGenerateScene = () => {
    const character = characters.find((c) => c.id === selectedCharacterId);
    if (!character || !selectedAction || !selectedExpression || !selectedBackground) {
      toast({
        title: "Missing Information",
        description: "Please select character, action, expression, and background",
        variant: "destructive",
      });
      return;
    }

    const prompt = `A ${character.age || "person"} ${character.gender || "character"} named ${character.name} ${selectedAction} with a ${selectedExpression} expression in ${selectedBackground} setting. Physical features: ${character.hair} hair, ${character.eyeColor} eyes, ${character.facialFeatures}. Wearing ${character.clothingStyle}. ${character.uniqueMarks ? `Distinctive marks: ${character.uniqueMarks}.` : ""} Professional character consistency, ultra detailed, cinematic lighting, photorealistic style.`;

    setGeneratedPrompt(prompt);
    toast({
      title: "Scene Generated!",
      description: "Character scene prompt created successfully",
    });
  };

  const handleCopyPrompt = async () => {
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

  return (
    <div className="space-y-8">
      {/* Character Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Character ({characters.length}/3)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name (optional)</label>
              <Input
                placeholder="Auto-generated if empty"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <Input
                placeholder="e.g., 25 years old"
                value={formData.age || ""}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <Input
                placeholder="e.g., Male, Female, Non-binary"
                value={formData.gender || ""}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hair Description</label>
              <Input
                placeholder="e.g., Long blonde wavy"
                value={formData.hair || ""}
                onChange={(e) => setFormData({ ...formData, hair: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Eye Color</label>
              <Input
                placeholder="e.g., Deep blue"
                value={formData.eyeColor || ""}
                onChange={(e) => setFormData({ ...formData, eyeColor: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Facial Features</label>
              <Input
                placeholder="e.g., Sharp jawline, freckles"
                value={formData.facialFeatures || ""}
                onChange={(e) => setFormData({ ...formData, facialFeatures: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Clothing Style</label>
            <Input
              placeholder="e.g., Casual jeans and t-shirt"
              value={formData.clothingStyle || ""}
              onChange={(e) => setFormData({ ...formData, clothingStyle: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unique Marks/Scars</label>
            <Input
              placeholder="e.g., Small scar above left eyebrow"
              value={formData.uniqueMarks || ""}
              onChange={(e) => setFormData({ ...formData, uniqueMarks: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveCharacter} className="w-full" disabled={characters.length >= 3}>
            Save Character
          </Button>
        </CardContent>
      </Card>

      {/* Saved Characters */}
      {characters.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Saved Characters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {characters.map((character) => (
              <Card key={character.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-8 w-8 text-primary" />
                      <h4 className="font-bold">{character.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCharacter(character.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    {character.age && <p>Age: {character.age}</p>}
                    {character.gender && <p>Gender: {character.gender}</p>}
                    {character.hair && <p>Hair: {character.hair}</p>}
                    {character.eyeColor && <p>Eyes: {character.eyeColor}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Scene Generator */}
      {characters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Scene with Character</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Character</label>
                <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose character" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Action/Pose</label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose action" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIONS.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expression</label>
                <Select value={selectedExpression} onValueChange={setSelectedExpression}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose expression" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPRESSIONS.map((exp) => (
                      <SelectItem key={exp} value={exp}>
                        {exp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background</label>
                <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose background" />
                  </SelectTrigger>
                  <SelectContent>
                    {BACKGROUNDS.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleGenerateScene} className="w-full">
              Generate Scene Prompt
            </Button>

            {generatedPrompt && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">Generated Scene Prompt</label>
                  <Button onClick={handleCopyPrompt} variant="outline" size="sm" className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-primary/30 p-4">
                  <Textarea
                    value={generatedPrompt}
                    readOnly
                    className="min-h-[120px] text-base border-0 bg-transparent resize-none focus:ring-0 font-mono"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
