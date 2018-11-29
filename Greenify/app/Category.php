<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'ch_categories';

    protected $fillable = [
        'name'
    ];

    function companies()
    {
        return $this->belongsToMany(Company::class, 'company_category');
    }

    function tags()
    {
        return $this->belongsToMany(Tag::class,'category_tag');
    }
}
