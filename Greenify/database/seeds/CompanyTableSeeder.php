<?php

use Illuminate\Database\Seeder;

class CompanyTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\Company::class,30)
            ->create()
            ->each(function($company){
                $company->categories()->attach(\App\Category::orderByRaw('RAND()')->first()->id);
            });
    }
}
