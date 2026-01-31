import ProfileImage from "./hero/profile-image";
import Content from "./hero/content";
import ScrollIndication from "./hero/scroll-indication";
import BokehBackground from "../bokeh-background";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-visible px-6 pb-24 pt-32 md:px-8 md:pb-20 md:pt-24 lg:px-12 lg:pb-16 lg:pt-10">
      {/* Bokeh background */}
      <BokehBackground />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left Column - Profile Image */}
        <ProfileImage />

        {/* Right Column - Content */}
        <Content />
      </div>

      {/* Scroll indicator */}
      <ScrollIndication />
    </section>
  );
}
