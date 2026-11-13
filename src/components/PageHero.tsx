export interface HeroImage {
  src: string;
  alt: string;
  credit: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: HeroImage;
}

export default function PageHero({ eyebrow, title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-stone-900 shadow-lg shadow-stone-900/10">
      <img
        src={image.src}
        alt={image.alt}
        width={1600}
        height={900}
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full animate-ken-burns object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-900/70 to-stone-900/20" />

      <div className="flex min-h-[280px] flex-col justify-end gap-3 p-5 sm:min-h-[400px] sm:gap-4 sm:p-10 lg:p-12">
        <p className="animate-fade-in inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-100 backdrop-blur">
          {eyebrow}
        </p>
        <h1 className="animate-fade-up max-w-2xl text-2xl font-semibold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="animate-fade-up max-w-xl text-[15px] leading-[1.5] text-stone-200 sm:text-base [animation-delay:120ms]">
          {subtitle}
        </p>
        <p className="animate-fade-in mt-2 text-xs text-stone-300/80 [animation-delay:300ms]">Photo: {image.credit} via Pexels</p>
      </div>
    </section>
  );
}
