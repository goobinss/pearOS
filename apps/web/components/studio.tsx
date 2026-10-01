"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { flushSync } from "react-dom";
import { Download, LockKeyhole } from "lucide-react";
import { Button } from "@pearos/ui/button";
import { Input } from "@pearos/ui/input";
import { Textarea } from "@pearos/ui/textarea";
import { drawCard, validateCard, type Template } from "@/lib/studio";
import { useHolder } from "./providers";

const templates: { id: Template; title: string; subtitle: string }[] = [
  { id: "keynote", title: "The Keynote", subtitle: "A clean introduction" },
  {
    id: "after-hours",
    title: "After Hours",
    subtitle: "For your next big idea",
  },
  {
    id: "blueprint",
    title: "Drawing Board",
    subtitle: "An experiment in progress",
  },
  { id: "club", title: "Pear Club", subtitle: "Cosmetic holder edition" },
];
export function Studio() {
  const holder = useHolder();
  const [name, setName] = useState("Pear Air");
  const [description, setDescription] = useState(
    "A little lighter. A little greener. An entirely fictional leap forward.",
  );
  const [template, setTemplate] = useState<Template>("keynote");
  const [ready, setReady] = useState(false),
    [notice, setNotice] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null),
    mascot = useRef<HTMLImageElement | null>(null);
  const selected =
    template === "club" && !holder.isHolder ? "keynote" : template;
  useEffect(() => {
    const image = new Image();
    image.src = "/pear-mascot.png";
    image.onload = () => {
      mascot.current = image;
      setReady(true);
    };
    image.onerror = () =>
      setNotice("The mascot could not load. Refresh to retry.");
    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, []);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (context && mascot.current)
      drawCard(
        context,
        { name, description, template: selected },
        mascot.current,
      );
  }, [name, description, selected, ready]);
  useEffect(() => {
    type ModelContext = {
      registerTool: (
        tool: {
          name: string;
          description: string;
          inputSchema: object;
          annotations: object;
          execute: (input: unknown) => unknown;
        },
        options: { signal: AbortSignal },
      ) => unknown;
    };
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: "configure_pear_card",
            description:
              "Stage the visible fictional Pear Studio card. Does not download or publish.",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 1, maxLength: 48 },
                description: { type: "string", minLength: 1, maxLength: 160 },
                template: {
                  type: "string",
                  enum: ["keynote", "after-hours", "blueprint", "club"],
                },
              },
              required: ["name", "description", "template"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: true },
            execute(input) {
              const value = validateCard(input);
              if (value.template === "club" && !holder.isHolder)
                throw new Error("The club template needs a fresh holder check");
              flushSync(() => {
                setName(value.name);
                setDescription(value.description);
                setTemplate(value.template);
              });
              const drawing = canvas.current?.getContext("2d");
              if (drawing && mascot.current)
                drawCard(drawing, value, mascot.current);
              return {
                staged: true,
                name: value.name,
                template: value.template,
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional browser enhancement. */
    }
    return () => lifecycle.abort();
  }, [holder.isHolder]);
  async function download() {
    setNotice("");
    try {
      validateCard({ name, description, template: selected });
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.current?.toBlob(
          (value) =>
            value ? resolve(value) : reject(new Error("Export failed")),
          "image/png",
        ),
      );
      const url = URL.createObjectURL(blob),
        anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `pear-${
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "announcement"
      }.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setNotice("Your 1200 × 675 PNG is ready to save.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not export the card",
      );
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">APPLES TO PEARS / EXPERIMENTS</p>
          <h1>Your next slightly brilliant idea.</h1>
          <p className="muted">
            Dream up a fictional Pear product. Give it a proper introduction.
          </p>
        </div>
        <span className="status status-cached">Pear Studio</span>
      </div>
      <div className="studio-grid">
        <section className="panel studio-controls">
          <h2>Make it a Pear.</h2>
          <label htmlFor="product-name">Product name</label>
          <Input
            id="product-name"
            value={name}
            maxLength={48}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          />
          <label htmlFor="product-description">The introduction</label>
          <Textarea
            id="product-description"
            value={description}
            maxLength={160}
            rows={4}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
          />
          <span className="character-count">{description.length} / 160</span>
          <fieldset>
            <legend>Choose a template</legend>
            <div className="template-options">
              {templates.map((option) => {
                const locked = option.id === "club" && !holder.isHolder;
                return (
                  <label
                    className={`template-option ${selected === option.id ? "selected" : ""} ${locked ? "locked" : ""}`}
                    key={option.id}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={option.id}
                      checked={selected === option.id}
                      disabled={locked}
                      onChange={() => setTemplate(option.id)}
                    />
                    <span className={`template-swatch swatch-${option.id}`} />
                    <span>
                      <strong>{option.title}</strong>
                      <span>{option.subtitle}</span>
                    </span>
                    {locked && <LockKeyhole size={16} />}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <Button
            className="download-button"
            disabled={!ready || !name.trim() || !description.trim()}
            onClick={download}
          >
            <Download size={17} />
            Download PNG
          </Button>
          <p className="small muted">
            Creates locally in your browser. Your text is not sent to an AI
            service.
          </p>
          <p className="studio-notice" role="status">
            {notice}
          </p>
        </section>
        <div className="studio-output">
          <div className="preview-heading">
            <span className="eyebrow">YOUR ANNOUNCEMENT</span>
            <span>1200 × 675 / PNG</span>
          </div>
          <canvas
            ref={canvas}
            width={1200}
            height={675}
            role="img"
            aria-label={`Fictional Pear product card: ${name}. ${description}`}
          />
          <div className="studio-caption">
            <span>BIG IDEAS. QUESTIONABLE FRUIT.</span>
            <span>PEAR STUDIO / V1</span>
          </div>
          <div className="holder-note">
            <span className="holder-symbol">P</span>
            <div>
              <strong>
                {holder.isHolder
                  ? "Your Pear Club edition is unlocked."
                  : "A little extra for the orchard."}
              </strong>
              <p>
                Connect a wallet holding A2P for the optional Pear Club template
                and a holder badge. Balance reads only; no token approvals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
