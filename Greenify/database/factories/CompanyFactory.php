<?php

use Faker\Generator as Faker;

$factory->define(\App\Company::class, function (Faker $faker) {
    return [
        'name' => $faker->company,
        'image' => $faker->imageUrl(),
        'link' => $faker->url,
        'description' => $faker->text(200)
    ];
});
