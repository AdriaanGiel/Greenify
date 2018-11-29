<?php

use Faker\Generator as Faker;

$factory->define(\App\Review::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
        'content' => $faker->text(250),
        'rating' => $faker->numberBetween(1,5),
    ];
});
