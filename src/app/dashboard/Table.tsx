'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface Proyecto {
  id: number,
  title: string,
  description: string,
  file: string | null,
  created_date: string | null
}

export default function CrudTable() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [rol, setRol] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')  // Si no hay sesión, redirige al login
        return
      }

      console.log("Datos del usuario logueado:", session.user) // Datos del usuario logueado

      const { data: perfil, error: perfilError } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", session.user.id)
        .single()

      if (perfilError) {
        console.error("Error al obtener el rol:", perfilError)
        return
      }

      setRol(perfil.rol)
      const { data: proyectosData, error: proyectosError } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', session.user.id)

      if (proyectosError) {
        console.error("Error al traer proyectos:", proyectosError)
      } else {
        setProyectos(proyectosData)
      }

      setLoading(false) 
    }

    fetchData()
  }, [router])

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Listado de proyectos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Archivo</TableHead>
                  {rol !== "Cliente" && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Aquí renderizamos una fila vacía mientras se carga */}
                <TableRow>
                  <TableCell colSpan={rol !== "Cliente" ? 4 : 3} className="text-center">
                    Cargando proyectos...
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Archivo</TableHead>
                  {rol !== "Cliente" && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {proyectos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={rol !== "Cliente" ? 4 : 3} className="text-center">
                      No hay proyectos disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  proyectos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.file}</TableCell>
                      {rol !== "Cliente" && (
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline">Editar</Button>
                          <Button size="sm" variant="destructive">Eliminar</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
