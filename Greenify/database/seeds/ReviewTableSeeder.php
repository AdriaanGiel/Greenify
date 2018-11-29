<?php

use Illuminate\Database\Seeder;

class ReviewTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\Review::class,10)
            ->create([
                'user_id' => \App\User::orderByRaw('RAND()')->first()->id,
                'company_id' => \App\Company::orderByRaw('RAND()')->first()->id
            ]);
    }
}
