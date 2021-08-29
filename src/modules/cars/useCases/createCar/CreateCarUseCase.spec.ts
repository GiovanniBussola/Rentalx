import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(
      carsRepositoryInMemory,
      categoriesRepositoryInMemory
    );
  });

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name car",
      description: "desc car",
      daily_rate: 100,
      license_plate: "ABC1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    expect(car).toHaveProperty("id");
  });

  it("should be able to create a new car with availability", async () => {
    const car = await createCarUseCase.execute({
      name: "Name car",
      description: "desc car",
      daily_rate: 100,
      license_plate: "ABC1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    expect(car.available).toBe(true);
  });

  it("should not be able to create a car with exists licence plate", async () => {
    await createCarUseCase.execute({
      name: "Name car2",
      description: "desc car2",
      daily_rate: 100,
      license_plate: "ABC1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });

    await expect(
      createCarUseCase.execute({
        name: "Name car",
        description: "desc car",
        daily_rate: 100,
        license_plate: "ABC1234",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category",
      })
    ).rejects.toEqual(new AppError("Plate already exists"));
  });
});
