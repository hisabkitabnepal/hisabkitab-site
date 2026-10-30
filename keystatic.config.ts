import { config, fields, singleton } from "@keystatic/core";

export default config({
  // Local dev edits files directly. Production (and KEYSTATIC_STORAGE=github
  // locally, for the one-time GitHub app setup) commits to the repo.
  storage:
    process.env.NODE_ENV === "production" ||
    process.env.KEYSTATIC_STORAGE === "github"
      ? { kind: "github", repo: "hisabkitabnepal/hisabkitab-site" }
      : { kind: "local" },
  singletons: {
    articles: singleton({
      label: "Blog articles",
      path: "lib/reference/articles",
      format: { data: "json" },
      schema: {
        articles: fields.array(
          fields.object({
            slug: fields.text({
              label: "URL slug",
              description:
                "Lowercase letters, numbers and hyphens. Becomes /blog/your-slug. Do not change it after publishing.",
              validation: {
                isRequired: true,
                pattern: {
                  regex: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                  message: "Use lowercase letters, numbers and hyphens only.",
                },
              },
            }),
            title: fields.text({
              label: "Title",
              validation: { isRequired: true },
            }),
            cat: fields.text({
              label: "Category",
              validation: { isRequired: true },
            }),
            date: fields.text({
              label: "Byline",
              description: 'Shown before the category, e.g. "Hisab Kitab".',
              validation: { isRequired: true },
            }),
            lead: fields.text({
              label: "Short summary",
              multiline: true,
              validation: { isRequired: true },
            }),
            cover: fields.image({
              label: "Cover image",
              description:
                "Optional. Landscape, about 1600×900, under 500 KB. Leave empty to keep the gradient.",
              directory: "public/blog",
              publicPath: "/blog/",
            }),
            secs: fields.array(
              fields.object({
                h: fields.text({
                  label: "Section heading",
                  validation: { isRequired: true },
                }),
                p: fields.array(
                  fields.text({
                    label: "Paragraph",
                    multiline: true,
                    validation: { isRequired: true },
                  }),
                  {
                    label: "Paragraphs",
                    itemLabel: (props) => props.value.slice(0, 60),
                  },
                ),
              }),
              {
                label: "Sections",
                itemLabel: (props) => props.fields.h.value,
              },
            ),
            note: fields.text({
              label: "Closing note",
              multiline: true,
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Articles",
            description:
              "Add new articles at the bottom. The last three are the newest and appear as the top three on the blog page, newest first.",
              itemLabel: (props) => props.fields.title.value,
          },
        ),
      },
    }),
  },
});
