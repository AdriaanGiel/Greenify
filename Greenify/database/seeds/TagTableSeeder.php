<?php

use Illuminate\Database\Seeder;

class TagTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tagsArray = [['name' => 'voedselverspilling'],['name' => 'elektrisch'],['name' => 'fiets'],['name' => 'auto'],['name' => 'bespaar'],['name' => 'delen']];

        \App\Tag::insert($tagsArray);

        \App\Tag::all()->each(function($tag){
           $tag->categories()->attach(\App\Category::orderByRaw('RAND()')->first()->id);
        });

    }
}
