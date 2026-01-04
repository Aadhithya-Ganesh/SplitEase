import { Scan, Users, ChartPie, Receipt } from "lucide-react";
import { motion } from "framer-motion";

function LandingPageContent() {
  const content = [
    {
      icon: <Scan />,
      title: "Scan Bills Instantly",
      description:
        "Upload or capture bills and let AI extract all items automatically",
    },
    {
      icon: <Users />,
      title: "Split with Friends",
      description:
        "Easily divide expenses among group members with custom splits",
    },
    {
      icon: <ChartPie />,
      title: "Track & Analyze",
      description:
        "Get insights into your spending patterns with beautiful charts",
    },
  ];

  return (
    <>
      <section className="bg-background py-10 md:py-15">
        <p className="text-foreground m-auto my-5 w-2/3 text-center text-2xl font-bold sm:w-fit sm:text-3xl md:my-10 md:text-4xl">
          Everything You Need to Split Bills
        </p>
        <p className="text-muted-foreground m-auto w-4/5 text-center sm:w-fit sm:text-lg md:text-xl">
          From scanning to splitting to settling up, we've got you covered
        </p>
        <div className="m-auto mt-10 grid w-2/3 max-w-250 grid-cols-1 gap-4 sm:grid-cols-2 md:w-4/5 md:grid-cols-3 md:gap-8">
          {content.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-card border-border flex flex-col items-center gap-4 rounded-lg border p-6 text-center md:p-15"
            >
              <div className="bg-primary/10 m-auto w-fit rounded-md p-2">
                <div className="text-primary">{item.icon}</div>
              </div>
              <h3 className="text-foreground text-xl font-bold">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="bg-background px-4 py-12 sm:py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center sm:mb-16"
          >
            <h2 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              How It Works
            </h2>
          </motion.div>

          <div className="space-y-4 sm:space-y-8">
            {[
              {
                step: "1",
                title: "Scan Your Bill",
                description: "Take a photo or upload your receipt",
              },
              {
                step: "2",
                title: "Create a Group",
                description: "Add friends who are splitting the bill",
              },
              {
                step: "3",
                title: "Assign Items",
                description: "Select who had what from the bill",
              },
              {
                step: "4",
                title: "Settle Up",
                description: "See exactly who owes what and settle balances",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 sm:gap-6"
              >
                <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold sm:h-12 sm:w-12 sm:text-lg">
                  {item.step}
                </div>
                <div className="border-border bg-card flex-1 rounded-xl border p-4 sm:p-5">
                  <h4 className="text-card-foreground mb-1 text-sm font-semibold sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-border bg-background border-t p-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Receipt className="text-primary h-5 w-5" />
            <span className="text-foreground font-semibold">SplitEase</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 SplitEase.</p>
        </div>
      </footer>
    </>
  );
}

export default LandingPageContent;
