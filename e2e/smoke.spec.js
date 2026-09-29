import { test, expect } from "@playwright/test";

test("loads the app shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "What's in your kitchen?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
});

test("shows an error when searching without an api key", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Dish name").fill("tacos");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Add your Spoonacular API key above before searching.")).toBeVisible();
});

test("searches, opens a recipe, saves it as a favorite, and closes the modal", async ({ page }) => {
  await page.route("**/recipes/complexSearch**", (route) =>
    route.fulfill({
      json: {
        results: [{ id: 1, title: "E2E Lasagna", image: "https://placehold.co/400x300", cuisines: ["Italian"] }],
        totalResults: 1,
      },
    })
  );
  await page.route("**/recipes/1/information**", (route) =>
    route.fulfill({
      json: {
        id: 1,
        title: "E2E Lasagna",
        extendedIngredients: [{ id: 1, original: "Pasta sheets" }],
        analyzedInstructions: [{ steps: [{ number: 1, step: "Bake it." }] }],
      },
    })
  );

  await page.goto("/");

  await page.getByLabel("Spoonacular API key").fill("e2e-test-key");
  await page.getByLabel("Dish name").fill("lasagna");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("E2E Lasagna").first()).toBeVisible();

  await page.getByRole("button", { name: "Add to favorites", exact: true }).click();
  await page.getByText("E2E Lasagna").first().click();

  await expect(page.getByText("Pasta sheets")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByText("Pasta sheets")).toBeHidden();

  await page.getByRole("button", { name: /my favorites/i }).click();
  await expect(page.getByRole("button", { name: "Remove from favorites", exact: true })).toBeVisible();
});
