import { supabase } from "@/integrations/supabase/client";

export type Branch = {
  id: string;
  name_ar: string;
  name_en: string;
  city_ar: string;
  city_en: string;
  address_ar: string;
  address_en: string;
  phone: string;
  map_url: string | null;
  opening_hours_ar: string;
  opening_hours_en: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export async function fetchBranches(activeOnly = true): Promise<Branch[]> {
  try {
    let query = supabase
      .from("branches")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("fetchBranches error:", error.message);
      return [];
    }
    return (data ?? []) as Branch[];
  } catch (e) {
    console.warn("fetchBranches exception:", e);
    return [];
  }
}

export async function createBranch(branch: Omit<Branch, "id" | "created_at">): Promise<void> {
  const { error } = await supabase.from("branches").insert(branch);
  if (error) throw error;
}

export async function updateBranch(id: string, branch: Partial<Branch>): Promise<void> {
  const { error } = await supabase.from("branches").update(branch).eq("id", id);
  if (error) throw error;
}

export async function deleteBranch(id: string): Promise<void> {
  const { error } = await supabase.from("branches").delete().eq("id", id);
  if (error) throw error;
}
