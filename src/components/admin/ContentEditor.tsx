"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  CircleDot,
  Contact,
  Home,
  Megaphone,
  RotateCcw,
  Send,
  Upload,
  Users,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { EditingProvider, buildFields, type FieldInfo } from "@/components/admin/editing-context";
import {
  EMPTY_SITE,
  countBrandChanges,
  countChanges,
  countContactsChanges,
  countDestaquesChanges,
  countHomeChanges,
  countServicesChanges,
  countValuesChanges,
  countVideosChanges,
  makeDestaque,
  type EditableService,
  type SiteState,
  type Snapshot,
} from "@/components/admin/editor-types";
import { MediaManagerModal, type MediaFocus } from "@/components/admin/media-management";
import FooterShell from "@/components/layout/footer-shell";
import HeroVideoSection from "@/components/sections/HeroVideoSection";
import { AboutImpactSection } from "@/components/home/about-impact";
import { AlgugestValuesSection } from "@/components/home/algugest-values-section";
import ServicosView from "@/components/site/servicos-view";
import ServiceDetailView from "@/components/site/service-detail-view";
import ContactosView from "@/components/site/contactos-view";
import SobreView from "@/components/site/sobre-view";
import { DestaquesView } from "@/components/site/destaques-view";

type SectionId = "inicio" | "servicos" | "destaques" | "contactos" | "sobre";

const TABS: Array<{ id: SectionId; label: string; icon: typeof Home }> = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "servicos", label: "Serviços", icon: Wrench },
  { id: "destaques", label: "Destaques", icon: Megaphone },
  { id: "contactos", label: "Contactos", icon: Contact },
  { id: "sobre", label: "Sobre Nós", icon: Users },
];

export function ContentEditor() {
  const router = useRouter();
  const [services, setServices] = useState<EditableService[]>([]);
  const [site, setSite] = useState<SiteState>(EMPTY_SITE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [active, setActive] = useState<SectionId>("inicio");
  const [activeSlug, setActiveSlug] = useState("");
  const [picker, setPicker] = useState<{ service: number; image: number } | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState<MediaFocus | null>(null);
  const [homePick, setHomePick] = useState<"edificio" | "equipa" | number | null>(null);
  const [destaquePick, setDestaquePick] = useState<number | null>(null);

  const totalDirty = countChanges(services, site, snapshot) > 0;

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (totalDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [totalDirty]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/content");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { services: EditableService[]; site: SiteState };
        setServices(data.services);
        setSite(data.site);
        setSnapshot({ services: data.services, site: data.site });
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const updateService = (index: number, patch: Partial<EditableService>) => {
    setServices((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const updateContacts = (key: keyof SiteState["contacts"], value: string) => {
    setSite((s) => ({ ...s, contacts: { ...s.contacts, [key]: value } }));
  };

  const updateBrand = (key: keyof SiteState["brand"], value: string) => {
    setSite((s) => ({ ...s, brand: { ...s.brand, [key]: value } }));
  };

  const updateValue = (index: number, patch: Partial<{ title: string; text: string }>) => {
    setSite((s) => ({
      ...s,
      values: s.values.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const addVideo = (path: string) => {
    setSite((s) => (s.videos.includes(path) ? s : { ...s, videos: [...s.videos, path] }));
  };

  const removeVideo = (index: number) => {
    setSite((s) => ({ ...s, videos: s.videos.filter((_, i) => i !== index) }));
  };

  const updateHomeImage = (kind: "edificio" | "equipa", path: string) => {
    setSite((s) => ({ ...s, home: { ...s.home, [kind]: path } }));
  };

  const updateProjetoImage = (index: number, image: string) => {
    setSite((s) => ({
      ...s,
      home: {
        ...s.home,
        projetos: s.home.projetos.map((p, i) => (i === index ? { ...p, image } : p)),
      },
    }));
  };

  const updateProjetoName = (index: number, alt: string) => {
    setSite((s) => ({
      ...s,
      home: {
        ...s.home,
        projetos: s.home.projetos.map((p, i) => (i === index ? { ...p, alt } : p)),
      },
    }));
  };

  const addProjeto = () => {
    setSite((s) => ({
      ...s,
      home: {
        ...s.home,
        projetos: [...s.home.projetos, { alt: `Obra ${s.home.projetos.length + 1}`, image: s.home.edificio }],
      },
    }));
  };

  const removeProjeto = (index: number) => {
    setSite((s) => ({
      ...s,
      home: {
        ...s.home,
        projetos: s.home.projetos.filter((_, i) => i !== index),
      },
    }));
  };

  const addDestaque = () => {
    setSite((s) => ({ ...s, destaques: [...s.destaques, makeDestaque()] }));
  };

  const updateDestaque = (index: number, patch: Partial<SiteState["destaques"][number]>) => {
    setSite((s) => ({
      ...s,
      destaques: s.destaques.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    }));
  };

  const removeDestaque = (index: number) => {
    setSite((s) => ({ ...s, destaques: s.destaques.filter((_, i) => i !== index) }));
  };

  const fields: Record<string, FieldInfo> = buildFields({
    site: {
      brand: site.brand as unknown as Record<string, string>,
      contacts: site.contacts as unknown as Record<string, string>,
      values: site.values,
      destaques: site.destaques,
    },
    services,
    snapshotSite: snapshot?.site as unknown as {
      brand: Record<string, string>;
      contacts: Record<string, string>;
      values: Array<{ title: string; text: string }>;
      destaques: SiteState["destaques"];
    },
    snapshotServices: snapshot?.services,
    updateBrand: (k, v) => updateBrand(k as keyof SiteState["brand"], v),
    updateContacts: (k, v) => updateContacts(k as keyof SiteState["contacts"], v),
    updateValue,
    updateService: (i, patch) => updateService(i, patch as Partial<EditableService>),
    updateDestaque,
  });

  const publish = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services, site }),
      });
      if (res.ok) {
        setSnapshot({ services, site });
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  const resetAll = async () => {
    if (!confirm("Repor todo o conteúdo para o padrão? As alterações serão perdidas.")) return;
    await fetch("/api/admin/content", { method: "POST" });
    window.location.reload();
  };

  const servicesChanged = countServicesChanges(services, snapshot);
  const contactsChanged = countContactsChanges(site, snapshot);
  const homeChanged =
    countBrandChanges(site, snapshot, ["slogan", "specialty", "mission"]) +
    countValuesChanges(site, snapshot) +
    countVideosChanges(site, snapshot) +
    countHomeChanges(site, snapshot) +
    (snapshot && site.contacts.brandName !== snapshot.site.contacts.brandName ? 1 : 0);
  const sobreChanged =
    countBrandChanges(site, snapshot, ["mission", "vision", "objective", "specialty"]) +
    countValuesChanges(site, snapshot) +
    (snapshot && site.contacts.director !== snapshot.site.contacts.director ? 1 : 0);
  const destaquesChanged = countDestaquesChanges(site, snapshot);

  const viewCount = (id: SectionId) =>
    id === "inicio"
      ? homeChanged
      : id === "servicos"
        ? servicesChanged
        : id === "destaques"
          ? destaquesChanged
          : id === "contactos"
            ? contactsChanged
            : sobreChanged;

  const activeIndex = services.findIndex((s) => s.slug === activeSlug);
  const activeService = activeIndex >= 0 ? services[activeIndex] : null;

  if (loading) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-16 text-center text-sm text-muted-foreground">
        A carregar conteúdo...
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Barra de controlo do editor */}
      <div className="sticky top-2 z-40 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-brand-navy">Conteúdo do site</span>
            <span className="text-xs text-muted-foreground">— passe o rato por um campo e clique em Editar</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {totalDirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-2 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-300">
                <CircleDot className="size-3.5" />
                {countChanges(services, site, snapshot)} alteração(ões) por publicar
              </span>
            )}
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              <Upload className="size-4" /> Imagens
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-[#3fa3ff] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-brand-blue/30 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="size-4" /> {saving ? "A publicar..." : "Publicar"}
            </button>
          </div>
        </div>

        {/* Separador de páginas */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto">
          {TABS.map((tab) => {
            const count = viewCount(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "relative inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors",
                  active === tab.id ? "bg-brand-blue text-white" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
                {count > 0 && (
                  <span className="grid size-4 place-items-center rounded-full bg-amber-400 text-[9px] font-extrabold text-amber-900">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700 ring-1 ring-green-200">
          <Check className="size-4" /> Conteúdo publicado! O site já está atualizado.
        </div>
      )}

      {/* O site real a "navegar", com campos editáveis */}
      <EditingProvider fields={fields}>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Faixa do navegador do site */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/z50slpsg/image/upload/v1791284939/algugest/imagens/empresa/emblema-algugest.png"
                alt="Algugest"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover ring-2 ring-brand-blue/40"
              />
              <span className="text-lg font-extrabold tracking-tight text-foreground uppercase">
                Algugest
                <span className="block text-xs font-semibold text-brand-blue">Serviços</span>
              </span>
            </div>
            <div className="hidden items-center gap-6 text-sm font-semibold text-foreground md:flex">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "cursor-pointer transition-colors hover:text-brand-blue",
                    active === tab.id ? "text-brand-blue" : "text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {active === "inicio" && (
            <>
              <HeroVideoSection
                eyebrowLabel={site.contacts.brandName}
                subtitle={site.brand.specialty}
                tagline={site.brand.slogan}
                videos={site.videos}
                onEditVideos={() => setMediaOpen("videos")}
              />
              <AboutImpactSection
                mission={site.brand.mission}
                edificio={site.home.edificio}
                equipa={site.home.equipa}
                projetos={site.home.projetos}
                destaques={site.destaques}
                onEditImage={(kind) => {
                  setMediaOpen(null);
                  setHomePick(kind);
                }}
                onManageObras={() => setMediaOpen("home")}
                onManageDestaques={() => setActive("destaques")}
              />
              <AlgugestValuesSection
                services={services}
                values={site.values}
                phoneWhatsApp={site.contacts.phoneWhatsApp}
              />
            </>
          )}

          {active === "servicos" &&
            (activeService ? (
              <ServiceDetailView
                key={activeService.slug}
                service={activeService}
                index={activeIndex}
                others={services.filter((s) => s.slug !== activeService.slug)}
                contacts={site.contacts as unknown as Record<string, string>}
                onBack={() => setActiveSlug("")}
                onOpenSlug={setActiveSlug}
                onPickImage={(image) => setPicker({ service: activeIndex, image })}
              />
            ) : (
              <ServicosView
                content={{
                  services,
                  brand: site.brand as unknown as Record<string, string>,
                  contacts: site.contacts as unknown as Record<string, string>,
                }}
                onEditCover={(index) => setPicker({ service: index, image: 0 })}
                onOpenService={setActiveSlug}
              />
            ))}

          {active === "destaques" && (
            <DestaquesView
              destaques={site.destaques}
              onAdd={addDestaque}
              onPickImage={(index) => setDestaquePick(index)}
              onRemove={removeDestaque}
              onUpdate={updateDestaque}
            />
          )}

          {active === "contactos" && (
            <ContactosView
              content={{
                brand: site.brand as unknown as Record<string, string>,
                contacts: site.contacts as unknown as Record<string, string>,
              }}
            />
          )}

          {active === "sobre" && (
            <SobreView
              content={{
                brand: site.brand as unknown as Record<string, string>,
                contacts: site.contacts as unknown as Record<string, string>,
                values: site.values,
              }}
              onOpenServices={() => setActive("servicos")}
            />
          )}

          <FooterShell contacts={site.contacts as unknown as Record<string, string>} />
        </div>
      </EditingProvider>

      {/* Repor padrão (zona discreta) */}
      <div className="flex justify-center pb-2">
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-red-600"
        >
          <RotateCcw className="size-3.5" /> Repor todo o site ao padrão
        </button>
      </div>

      {/* Troca de fotografia de um serviço */}
      <ImagePicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        onPick={(path) => {
          if (picker) {
            const current = services[picker.service];
            updateService(picker.service, {
              images: [
                ...current.images.slice(0, picker.image),
                path,
                ...current.images.slice(picker.image + 1),
              ],
            });
          }
          setPicker(null);
        }}
      />

      {/* Upload de imagens (qualquer página) */}
      <ImagePicker
        open={galleryOpen && picker === null && homePick === null}
        selectable={false}
        onClose={() => setGalleryOpen(false)}
        onPick={() => setGalleryOpen(false)}
      />

      {/* Média da página inicial: vídeos do carrossel e fotos da Home */}
      <MediaManagerModal
        open={mediaOpen !== null && picker === null && homePick === null}
        focus={mediaOpen ?? "videos"}
        onClose={() => setMediaOpen(null)}
        videos={site.videos}
        onAddVideo={addVideo}
        onRemoveVideo={removeVideo}
        home={site.home}
        onEditImage={(target) => {
          setMediaOpen(null);
          setHomePick(target);
        }}
        onAddProjeto={addProjeto}
        onRemoveProjeto={removeProjeto}
        onProjetoName={updateProjetoName}
      />

      {/* Troca de fotografia da Home (imagem principal / equipa / obra) */}
      <ImagePicker
        open={homePick !== null && picker === null}
        onClose={() => setHomePick(null)}
        onPick={(path) => {
          if (homePick === "edificio" || homePick === "equipa") updateHomeImage(homePick, path);
          else if (homePick !== null) updateProjetoImage(homePick, path);
          setHomePick(null);
        }}
      />

      {/* Troca de imagem de um destaque */}
      <ImagePicker
        open={destaquePick !== null && picker === null && homePick === null}
        onClose={() => setDestaquePick(null)}
        onPick={(path) => {
          if (destaquePick !== null) updateDestaque(destaquePick, { image: path });
          setDestaquePick(null);
        }}
      />
    </div>
  );
}