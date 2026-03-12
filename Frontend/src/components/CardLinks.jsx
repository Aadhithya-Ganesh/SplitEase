import { ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";

function CardLinks({ url, title, description, icon }) {
  return (
    <Link to={url}>
      <div className="bg-card border-border hover:border-primary flex items-center justify-between gap-5 rounded-2xl border p-8 transition-colors">
        <div className="bg-primary/10 w-fit rounded-lg p-5">{icon}</div>
        <div className="w-8/9">
          <p className="text-card-foreground text-xl font-bold">{title}</p>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="text-muted-foreground hover:text-primary" />
      </div>
    </Link>
  );
}

export default CardLinks;
