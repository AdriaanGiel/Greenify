<?php

use Illuminate\Database\Seeder;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $catArray = [['name' => 'delen'],['name' => 'vervoer'],['name' => 'eten']];
        \App\Category::insert($catArray);

    }
}
