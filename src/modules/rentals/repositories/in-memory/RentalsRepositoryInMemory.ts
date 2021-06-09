import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

import { IRentalsRepository } from "../IRentalsRepository";

class RentalsRepositoryInMemory implements IRentalsRepository {
  private rentals: Rental[] = [];

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const car = this.rentals.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );
    return car;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const user = this.rentals.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );
    return user;
  }

  async findById(id: string): Promise<Rental> {
    const rental = this.rentals.find((rental) => rental.id === id);
    return rental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rental = this.rentals.filter((rental) => rental.user_id === user_id);
    return rental;
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      expected_return_date,
      user_id,
      start_date: new Date(),
      id,
      end_date,
      total,
    });

    this.rentals.push(rental);

    return rental;
  }
}

export { RentalsRepositoryInMemory };
