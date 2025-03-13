import { User, Clock, Lock } from "lucide-react";

const features = [
  {
    title: "Sign up for free",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id autem culpa blanditiis soluta quas praesentium odio accusantium, voluptatibus temporibus, est, adipisci dicta fugit iste vitae accusamus sapiente laboriosam fugiat porro.",
    icon: User,
  },
  {
    title: "Blazing fast",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum, voluptatum voluptas reiciendis ipsum debitis voluptatibus consequuntur repellendus recusandae ipsa quisquam doloribus repellat, quas, sed porro accusamus dolores commodi est assumenda?",
    icon: Clock,
  },
  {
    title: "Easy to use",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus dolor voluptatum corrupti aut cumque ex omnis minima laudantium autem? Laboriosam, architecto eligendi enim animi quibusdam facere possimus. Hic, natus provident.",
    icon: User,
  },
  {
    title: "Secure and private",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt inventore libero, harum ratione voluptatem aperiam cupiditate quidem optio eveniet porro esse, repellendus iusto, a facilis? Nobis corrupti earum facere pariatur.",
    icon: Lock,
  },
];

export default function Features() {
  return (
    <div className="py-24">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary text-xl">
          Schedule fast, schedule easy
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Schedule meetings in seconds
        </h1>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
          With Calendary, you can schedule meetings in seconds. We make it easy
          to find the perfect time for your meetings. The meeting will be sent
          to your calendar automatically.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.title} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="size-6 text-white" />
                </div>
                {feature.title}
              </div>
              <p className="mt-2 text-sm leading-slug text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
