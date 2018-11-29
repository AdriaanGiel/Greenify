<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'image',
        'link',
        'description'
    ];

    //TODO Maybe add tags to companies

    function categories()
    {
        return $this->belongsToMany(Category::class,'company_category');
    }

    function reviews()
    {
        return $this->hasMany(Review::class);
    }



}
