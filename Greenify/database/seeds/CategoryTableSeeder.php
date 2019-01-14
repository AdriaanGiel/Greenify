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
        $catArray = [
            ['name' => 'eten', 'color' => '#BADC58'],
            ['name' => 'vervoer', 'color' => '#EB4D4B'],
            ['name' => 'winkels', 'color' => '#7ED6DF']
        ];
        \App\Category::insert($catArray);

    }
}
