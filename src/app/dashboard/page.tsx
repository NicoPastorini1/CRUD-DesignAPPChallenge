'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CrudForm from "./CrudForm";

interface Proyecto {
  id: string;
  title: string;
  description: string;
  file: string | null;
  created_date: string;
  designer_id: string | null;
  designer_name: string | null;
  client_id: string | null;
  client_name: string | null;
  manager_name: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCrudForm, setShowCrudForm] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  // Asegurarse de que el componente esté montado antes de realizar acciones
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      // Obtener la sesión del usuario
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data: perfil, error: perfilError } = await supabase
        .from("profiles")
        .select("username, role")
        .eq('id', session.user.id) // Asegurarse de obtener el perfil correcto
        .single();

      if (perfilError) {
        console.error("Error al obtener el perfil:", perfilError);
        setLoading(false);
        return;
      }

      setRole(perfil.role);
      setUser(perfil.username || "Usuario");

      // Consultar los proyectos y sus detalles
      const { data: proyectosData, error: proyectosError } = await supabase
        .from("projects")
        .select(`
          id, 
          name, 
          description, 
          files,
          created_at,
          client_id, 
          designer_id, 
          manager_id,
          client:profiles!client_id(username),
          designer:profiles!designer_id(username),
          manager:profiles!manager_id(username)
        `);

      console.log("Datos de proyectos:", proyectosData);

      if (proyectosError) {
        console.error("Error al traer proyectos:", proyectosError);
      } else {
        const proyectosConNombres = proyectosData.map((proyecto: any) => ({
          id: proyecto.id,
          title: proyecto.name,
          description: proyecto.description,
          file: proyecto.files,
          created_date: proyecto.created_at,
          designer_id: proyecto.designer_id,
          designer_name: proyecto.designer?.username || "Sin diseñador",
          client_id: proyecto.client_id,
          client_name: proyecto.client?.username || "Sin cliente",
          manager_name: proyecto.manager?.username || "Sin Project Manager",
        }));

        setProyectos(proyectosConNombres);
      }

      setLoading(false);
    };

    fetchData();
  }, [mounted, router]);

  const handleShowCrudForm = () => setShowCrudForm(!showCrudForm);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Bienvenido, {user}</CardTitle>
          <Button onClick={handleLogout}>Cerrar Sesión</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : (
            <>
              <Button className="mb-4" onClick={handleShowCrudForm}>
                {showCrudForm ? "Cancelar" : "Agregar Proyecto"}
              </Button>
              {showCrudForm ? (
                <CrudForm role={role}/>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Archivo</TableHead>
                      <TableHead>Diseñador Asignado</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Project Manager</TableHead>
                      {role !== "Cliente" && (
                        <TableHead className="text-right">Acciones</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proyectos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No hay proyectos disponibles
                        </TableCell>
                      </TableRow>
                    ) : (
                      proyectos.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.file || "Sin archivo"}</TableCell>
                          <TableCell>{item.designer_name}</TableCell>
                          <TableCell>{item.client_name}</TableCell>
                          <TableCell>{item.manager_name}</TableCell>
                          {role !== "Cliente" && (
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
