import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    author: "John D.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Excellent laptop for business use. Battery life is outstanding and the build quality is top-notch."
  },
  {
    id: 2,
    author: "Sarah M.",
    rating: 5,
    date: "1 month ago",
    comment: "Love the lightweight design. Perfect for travel and daily commute. Highly recommend!"
  },
  {
    id: 3,
    author: "Mike R.",
    rating: 4,
    date: "1 month ago",
    comment: "Great performance and display. Only wish it had more USB-A ports."
  }
];

export function ProductReviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3 pb-6 border-b last:border-0 last:pb-0">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                      }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
