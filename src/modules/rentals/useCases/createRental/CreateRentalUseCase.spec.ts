import dayjs from "dayjs";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: IRentalsRepository;
let dayJsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: ICarsRepository;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "days").toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayJsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Car Test",
      daily_rate: 20,
      license_plate: "test",
      fine_amount: 40,
      category_id: "1234",
      brand: "brand",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    const car1 = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Car Test",
      daily_rate: 20,
      license_plate: "test",
      fine_amount: 40,
      category_id: "1234",
      brand: "brand",
      id: "111",
    });
    const car2 = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Car Test",
      daily_rate: 20,
      license_plate: "test",
      fine_amount: 40,
      category_id: "1234",
      brand: "brand",
      id: "222",
    });

    await createRentalUseCase.execute({
      user_id: "123",
      car_id: car1.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: car2.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Car Test",
      daily_rate: 20,
      license_plate: "test",
      fine_amount: 40,
      category_id: "1234",
      brand: "brand",
      id: "111",
    });

    await createRentalUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });
    await expect(
      createRentalUseCase.execute({
        user_id: "123456",
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("should not be able to create a new rental with invalid return time", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "12345",
        car_id: "222222222",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Invalid return time"));
  });
});
