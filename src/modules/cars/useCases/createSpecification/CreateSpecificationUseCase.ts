import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

interface IRequestDTO {
  name: string;
  description: string;
}

class CreateSpecificationUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {}

  execute({ name, description }: IRequestDTO): void {
    const categoryAlreadyExists = this.specificationsRepository.findByName(
      name
    );

    if (categoryAlreadyExists) {
      throw new Error("Specification already exists");
    }

    this.specificationsRepository.create({ name, description });
  }
}

export { CreateSpecificationUseCase };
