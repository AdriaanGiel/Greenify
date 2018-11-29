<?php

use Illuminate\Database\Seeder;

class CommentTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\Comment::class,25)
            ->create([
                'user_id' => \App\User::orderByRaw('RAND()')->first()->id,
                'review_id' => \App\Review::orderByRaw('RAND()')->first()->id
            ]);
    }
}
