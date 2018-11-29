<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $table = 'ch_tags';

    protected $fillable = [
        'name'
    ];

    function categories()
    {
        return $this->belongsToMany(Category::class,'category_tag');
    }

    function profiles()
    {
        return $this->belongsToMany(Profile::class,'user_profile_tag');
    }

}
