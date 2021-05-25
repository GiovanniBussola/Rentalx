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

  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      expected_return_date,
      user_id,
      start_date: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }
}

export { RentalsRepositoryInMemory };
