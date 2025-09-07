import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @GrpcMethod('CatalogService', 'CreateProduct')
  async createProduct(data: any) {
    return this.catalogService.createProduct(data);
  }

  @GrpcMethod('CatalogService', 'GetProduct')
  async getProduct(data: any) {
    return this.catalogService.getProduct(data);
  }

  @GrpcMethod('CatalogService', 'UpdateProduct')
  async updateProduct(data: any) {
    return this.catalogService.updateProduct(data);
  }

  @GrpcMethod('CatalogService', 'DeleteProduct')
  async deleteProduct(data: any) {
    return this.catalogService.deleteProduct(data);
  }

  @GrpcMethod('CatalogService', 'GetProducts')
  async getProducts(data: any) {
    return this.catalogService.getProducts(data);
  }

  @GrpcMethod('CatalogService', 'SearchProducts')
  async searchProducts(data: any) {
    return this.catalogService.searchProducts(data);
  }

  @GrpcMethod('CatalogService', 'GetFeaturedProducts')
  async getFeaturedProducts(data: any) {
    return this.catalogService.getFeaturedProducts(data);
  }

  @GrpcMethod('CatalogService', 'GetTrendingProducts')
  async getTrendingProducts(data: any) {
    return this.catalogService.getTrendingProducts(data);
  }

  @GrpcMethod('CatalogService', 'GetVendorProducts')
  async getVendorProducts(data: any) {
    return this.catalogService.getVendorProducts(data);
  }

  @GrpcMethod('CatalogService', 'UpdateProductStatus')
  async updateProductStatus(data: any) {
    return this.catalogService.updateProductStatus(data);
  }

  @GrpcMethod('CatalogService', 'GetProductAnalytics')
  async getProductAnalytics(data: any) {
    return this.catalogService.getProductAnalytics(data);
  }

  @GrpcMethod('CatalogService', 'TrackProductView')
  async trackProductView(data: any) {
    return this.catalogService.trackProductView(data);
  }

  @GrpcMethod('CatalogService', 'TrackProductDownload')
  async trackProductDownload(data: any) {
    return this.catalogService.trackProductDownload(data);
  }
}
