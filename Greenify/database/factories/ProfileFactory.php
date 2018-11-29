<?php

use Faker\Generator as Faker;

$factory->define(\App\Profile::class, function (Faker $faker) {
    return [
        'firstname'     => $faker->firstName(),
        'insertion'     => $faker->citySuffix,
        'lastname'      => $faker->lastName,
        'street'        => $faker->streetName,
        'number'        => $faker->buildingNumber,
        'number_insertion' => $faker->streetSuffix,
        'zipcode'       => $faker->postcode,
        'location'      => $faker->city
    ];
});
