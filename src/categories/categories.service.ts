import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoriesRespository: Repository<Category>) { }

  async create(createCategoryInput: CreateCategoryInput) {
    const check = await this.categoriesRespository.findOne({
      where: {
        categoryName: createCategoryInput.categoryName,
      }
    });
    if (check) {
      return "have this categories";
    } else {
      let newCategory = await this.categoriesRespository.create(createCategoryInput);
      return this.categoriesRespository.save(newCategory);
    }
  }

  async findAll(pageNumber: number, numberofAPage: number) {
    const skip = (pageNumber - 1) * numberofAPage;
    return await this.categoriesRespository.find({
      where: {
        isHidden: true
      },
      relations: ['book'],
      skip: skip, // Số bản ghi cần bỏ qua
      take: numberofAPage, // Số bản ghi cần lấy
    });
  }

  findOne(id: string) {
    return this.categoriesRespository.findOne({
      where: {
        categoryID: id,
      },
      relations: ['book'],
    });
  }

  async findSomeIds(id: string[]) {
    return await this.categoriesRespository.findBy({
      categoryID: In(id)
    })
  }
  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
    let categoriesUpdate = await this.findOne(id);
    if (updateCategoryInput.categoryName) {
      categoriesUpdate.categoryName = updateCategoryInput.categoryName;
    }
    if (updateCategoryInput.isHidden) {
      categoriesUpdate.isHidden = true;
    }
    return this.categoriesRespository.save(categoriesUpdate);
  }

  async remove(id: string) {
    let categoriesUpdate = await this.findOne(id);
    if (categoriesUpdate) {
      categoriesUpdate.isHidden = false;
    }
    return this.categoriesRespository.save(categoriesUpdate);
  }
}
