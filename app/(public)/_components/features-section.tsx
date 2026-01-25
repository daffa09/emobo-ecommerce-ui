import { Zap, ShieldCheck, Headset } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Cutting-Edge Technology",
    description: "Stay ahead with the latest processors and hardware engineered for peak performance."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Guaranteed Authenticity",
    description: "Every product is 100% original and comes with a full manufacturer's official warranty."
  },
  {
    icon: <Headset className="w-8 h-8" />,
    title: "Expert Assistance",
    description: "Our dedicated technical team is available 24/7 to ensure your workflow never stops."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background transition-colors duration-500">
      <div className="container-emobo">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-6 group">
              <div className="w-20 h-20 rounded-lg bg-primary/5 flex items-center justify-center text-primary transition-smooth group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
