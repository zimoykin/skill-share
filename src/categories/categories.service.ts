import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  /**
   * Retrieves a list of categories.
   * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
   */
  async getAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getOne(id: string) {
    return this.categoriesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        skills: true,
      },
    });
  }

  // admin

  /**
   * Creates a new category.
   * @param {Partial<Category>} dto - The data transfer object containing the details of the category to create.
   * @returns {Promise<Category>} A promise that resolves to the newly created category.
   */
  async createCategory(dto: Partial<Category>): Promise<Category> {
    const category = this.categoriesRepository.create(dto);
    return this.categoriesRepository.save(category);
  }
}
