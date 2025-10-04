import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // Blog endpoints
  @Public()
  @Get('blog/posts')
  @ApiOperation({ summary: 'Get blog posts' })
  @ApiResponse({ status: 200, description: 'Blog posts retrieved successfully' })
  async getBlogPosts(@Query() query: any) {
    return this.contentService.getBlogPosts(query);
  }

  @Public()
  @Get('blog/posts/:slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved successfully' })
  async getBlogPost(@Param('slug') slug: string) {
    return this.contentService.getBlogPost(slug);
  }

  @Post('blog/posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  async createBlogPost(@Body() data: any, @GetUser() user: any) {
    return this.contentService.createBlogPost({ ...data, authorId: user.id });
  }

  @Put('blog/posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  async updateBlogPost(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.contentService.updateBlogPost({ postId: id, authorId: user.id, ...data });
  }

  @Delete('blog/posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully' })
  async deleteBlogPost(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.deleteBlogPost({ postId: id, authorId: user.id });
  }

  // Help Center endpoints
  @Public()
  @Get('help/articles')
  @ApiOperation({ summary: 'Get help articles' })
  @ApiResponse({ status: 200, description: 'Help articles retrieved successfully' })
  async getHelpArticles(@Query() query: any) {
    return this.contentService.getHelpArticles(query);
  }

  @Public()
  @Get('help/articles/:id')
  @ApiOperation({ summary: 'Get help article by ID' })
  @ApiResponse({ status: 200, description: 'Help article retrieved successfully' })
  async getHelpArticle(@Param('id') id: string) {
    return this.contentService.getHelpArticle(id);
  }

  @Public()
  @Get('help/categories')
  @ApiOperation({ summary: 'Get help categories' })
  @ApiResponse({ status: 200, description: 'Help categories retrieved successfully' })
  async getHelpCategories() {
    return this.contentService.getHelpCategories();
  }

  @Post('help/articles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create help article' })
  @ApiResponse({ status: 201, description: 'Help article created successfully' })
  async createHelpArticle(@Body() data: any, @GetUser() user: any) {
    return this.contentService.createHelpArticle({ ...data, authorId: user.id });
  }

  @Put('help/articles/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update help article' })
  @ApiResponse({ status: 200, description: 'Help article updated successfully' })
  async updateHelpArticle(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.contentService.updateHelpArticle({ articleId: id, authorId: user.id, ...data });
  }

  @Delete('help/articles/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete help article' })
  @ApiResponse({ status: 200, description: 'Help article deleted successfully' })
  async deleteHelpArticle(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.deleteHelpArticle({ articleId: id, authorId: user.id });
  }

  @Public()
  @Get('help/articles/search')
  @ApiOperation({ summary: 'Search help articles' })
  @ApiResponse({ status: 200, description: 'Search completed successfully' })
  async searchHelpArticles(@Query('q') query: string) {
    return this.contentService.searchHelpArticles(query);
  }

  // Tutorials endpoints
  @Public()
  @Get('tutorials')
  @ApiOperation({ summary: 'Get tutorials' })
  @ApiResponse({ status: 200, description: 'Tutorials retrieved successfully' })
  async getTutorials(@Query() query: any) {
    return this.contentService.getTutorials(query);
  }

  @Public()
  @Get('tutorials/:id')
  @ApiOperation({ summary: 'Get tutorial by ID' })
  @ApiResponse({ status: 200, description: 'Tutorial retrieved successfully' })
  async getTutorial(@Param('id') id: string) {
    return this.contentService.getTutorial(id);
  }

  @Post('tutorials')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create tutorial' })
  @ApiResponse({ status: 201, description: 'Tutorial created successfully' })
  async createTutorial(@Body() data: any, @GetUser() user: any) {
    return this.contentService.createTutorial({ ...data, authorId: user.id });
  }

  @Put('tutorials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tutorial' })
  @ApiResponse({ status: 200, description: 'Tutorial updated successfully' })
  async updateTutorial(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.contentService.updateTutorial({ tutorialId: id, authorId: user.id, ...data });
  }

  @Delete('tutorials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tutorial' })
  @ApiResponse({ status: 200, description: 'Tutorial deleted successfully' })
  async deleteTutorial(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.deleteTutorial({ tutorialId: id, authorId: user.id });
  }

  @Public()
  @Get('tutorials/categories')
  @ApiOperation({ summary: 'Get tutorial categories' })
  @ApiResponse({ status: 200, description: 'Tutorial categories retrieved successfully' })
  async getTutorialCategories() {
    return this.contentService.getTutorialCategories();
  }

  // Resources endpoints
  @Public()
  @Get('resources')
  @ApiOperation({ summary: 'Get resources' })
  @ApiResponse({ status: 200, description: 'Resources retrieved successfully' })
  async getResources(@Query() query: any) {
    return this.contentService.getResources(query);
  }

  @Public()
  @Get('resources/:id')
  @ApiOperation({ summary: 'Get resource by ID' })
  @ApiResponse({ status: 200, description: 'Resource retrieved successfully' })
  async getResource(@Param('id') id: string) {
    return this.contentService.getResource(id);
  }

  @Post('resources')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create resource' })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  async createResource(@Body() data: any, @GetUser() user: any) {
    return this.contentService.createResource({ ...data, authorId: user.id });
  }

  @Put('resources/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update resource' })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  async updateResource(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.contentService.updateResource({ resourceId: id, authorId: user.id, ...data });
  }

  @Delete('resources/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource' })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  async deleteResource(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.deleteResource({ resourceId: id, authorId: user.id });
  }

  @Get('resources/:id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download resource' })
  @ApiResponse({ status: 200, description: 'Resource download initiated' })
  async downloadResource(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.downloadResource({ resourceId: id, userId: user.id });
  }

  // Case Studies endpoints
  @Public()
  @Get('case-studies')
  @ApiOperation({ summary: 'Get case studies' })
  @ApiResponse({ status: 200, description: 'Case studies retrieved successfully' })
  async getCaseStudies(@Query() query: any) {
    return this.contentService.getCaseStudies(query);
  }

  @Public()
  @Get('case-studies/:id')
  @ApiOperation({ summary: 'Get case study by ID' })
  @ApiResponse({ status: 200, description: 'Case study retrieved successfully' })
  async getCaseStudy(@Param('id') id: string) {
    return this.contentService.getCaseStudy(id);
  }

  @Post('case-studies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create case study' })
  @ApiResponse({ status: 201, description: 'Case study created successfully' })
  async createCaseStudy(@Body() data: any, @GetUser() user: any) {
    return this.contentService.createCaseStudy({ ...data, authorId: user.id });
  }

  @Put('case-studies/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update case study' })
  @ApiResponse({ status: 200, description: 'Case study updated successfully' })
  async updateCaseStudy(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.contentService.updateCaseStudy({ caseStudyId: id, authorId: user.id, ...data });
  }

  @Delete('case-studies/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete case study' })
  @ApiResponse({ status: 200, description: 'Case study deleted successfully' })
  async deleteCaseStudy(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.deleteCaseStudy({ caseStudyId: id, authorId: user.id });
  }

  // Press Releases endpoints
  @Public()
  @Get('press')
  @ApiOperation({ summary: 'Get press releases' })
  @ApiResponse({ status: 200, description: 'Press releases retrieved successfully' })
  async getPressReleases(@Query() query: any) {
    return this.contentService.getPressReleases(query);
  }

  @Public()
  @Get('press/:id')
  @ApiOperation({ summary: 'Get press release by ID' })
  @ApiResponse({ status: 200, description: 'Press release retrieved successfully' })
  async getPressRelease(@Param('id') id: string) {
    return this.contentService.getPressRelease(id);
  }

  @Post('press')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create press release' })
  @ApiResponse({ status: 201, description: 'Press release created successfully' })
  async createPressRelease(@Body() data: any, @GetUser() user: any) {
    return this.contentService.createPressRelease({ ...data, authorId: user.id });
  }

  @Put('press/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update press release' })
  @ApiResponse({ status: 200, description: 'Press release updated successfully' })
  async updatePressRelease(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.contentService.updatePressRelease({ pressId: id, authorId: user.id, ...data });
  }

  @Delete('press/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete press release' })
  @ApiResponse({ status: 200, description: 'Press release deleted successfully' })
  async deletePressRelease(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.deletePressRelease({ pressId: id, authorId: user.id });
  }

  // Careers endpoints
  @Public()
  @Get('careers/jobs')
  @ApiOperation({ summary: 'Get job listings' })
  @ApiResponse({ status: 200, description: 'Job listings retrieved successfully' })
  async getJobListings(@Query() query: any) {
    return this.contentService.getJobListings(query);
  }

  @Public()
  @Get('careers/jobs/:id')
  @ApiOperation({ summary: 'Get job listing by ID' })
  @ApiResponse({ status: 200, description: 'Job listing retrieved successfully' })
  async getJobListing(@Param('id') id: string) {
    return this.contentService.getJobListing(id);
  }

  @Post('careers/jobs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create job listing' })
  @ApiResponse({ status: 201, description: 'Job listing created successfully' })
  async createJobListing(@Body() data: any, @GetUser() user: any) {
    return this.contentService.createJobListing({ ...data, authorId: user.id });
  }

  @Put('careers/jobs/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job listing' })
  @ApiResponse({ status: 200, description: 'Job listing updated successfully' })
  async updateJobListing(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.contentService.updateJobListing({ jobId: id, authorId: user.id, ...data });
  }

  @Delete('careers/jobs/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete job listing' })
  @ApiResponse({ status: 200, description: 'Job listing deleted successfully' })
  async deleteJobListing(@Param('id') id: string, @GetUser() user: any) {
    return this.contentService.deleteJobListing({ jobId: id, authorId: user.id });
  }

  @Post('careers/jobs/:id/apply')
  @ApiOperation({ summary: 'Apply for job' })
  @ApiResponse({ status: 201, description: 'Job application submitted successfully' })
  async applyForJob(@Param('id') id: string, @Body() data: any) {
    return this.contentService.applyForJob({ jobId: id, ...data });
  }

  @Get('careers/applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get job applications' })
  @ApiResponse({ status: 200, description: 'Job applications retrieved successfully' })
  async getJobApplications(@Query() query: any, @GetUser() user: any) {
    return this.contentService.getJobApplications({ ...query, userId: user.id });
  }
}
