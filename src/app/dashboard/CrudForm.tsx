import { Paperclip } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

interface CrudFormProps {
  role: string | null;
}

export default function CrudForm({ role }: CrudFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fileName, setFileName] = useState("")
  const [message, setMessage] = useState("")
  const [selectedRole, setSelectedRole] = useState(role || "")
  const [designers, setDesigners] = useState<{ id: string; username: string }[]>([])
  const [selectedDesigner, setSelectedDesigner] = useState<string>("")


  useEffect(() => {
    const fetchDesigners = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("role", "Diseñador")

      if (error) {
        console.error("Error al cargar diseñadores:", error)
      } else {
        setDesigners(data)
        console.log(data)
      }
    }
    fetchDesigners()
  }, [])

  

  const handleCreate = () => {
    if(!title || !description || selectedDesigner )
    {
      setMessage("⚠️ Por favor, completá todos los campos obligatorios.")
      return
    }
    setMessage(`✅ Creado: ${title} (${selectedRole})`)
  }

  const handleEdit = () => {
    setMessage(`✏️ Editado: ${title}`)
  }

  const handleDelete = () => {
    setMessage(`🗑️ Eliminado: ${title}`)
    setTitle("")
    setDescription("")
    setFileName("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Formulario CRUD</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mi tarea"
          />
        </div>

        <div>
          <Label htmlFor="file" className="cursor-pointer">
            <Button variant="outline" type="button">
              <Paperclip className="w-4 h-4 mr-2" />
              Adjuntar archivo
            </Button>
          </Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {fileName && <p className="text-sm text-muted-foreground mt-1">Archivo: {fileName}</p>}
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la tarea..."
          />
        </div>

        <div>
          <Label htmlFor="designer">Asignar diseñador</Label>
          <Select onValueChange={setSelectedDesigner}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar diseñador" />
            </SelectTrigger>
            <SelectContent>
              {designers.map((designer) => (
                <SelectItem key={designer.id} value={designer.id}>
                  {designer.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <Button onClick={handleCreate}>Crear</Button>

          {/* Ocultar botones si el rol es Cliente o Diseñador */}
          {selectedRole !== "Cliente" && selectedRole !== "Diseñador" && (
            <>
              <Button onClick={handleEdit} variant="secondary">Editar</Button>
              <Button onClick={handleDelete} variant="destructive">Borrar</Button>
            </>
          )}
        </div>

        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  )
}
