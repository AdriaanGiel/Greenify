<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'user_profile';

    protected $fillable = [
        'firstname',
        'insertion',
        'lastname',
        'street',
        'number',
        'number_insertion',
        'zipcode',
        'location'
    ];

    protected $with = 'user';

    function user()
    {
        return $this->belongsTo(User::class);
    }

    function tags()
    {
        return $this->belongsToMany(Tag::class,'user_profile_tag');
    }
}
