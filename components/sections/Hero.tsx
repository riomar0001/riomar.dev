import BokehBackground from '../bokeh-background';
import Content from './hero/content';
import ProfileImage from './hero/profile-image';
import ScrollIndication from './hero/scroll-indication';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-visible px-6 pt-32 pb-24 md:px-8 md:pt-24 md:pb-20 lg:px-12 lg:pt-10 lg:pb-16">
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
