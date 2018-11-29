<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'title',
        'content',
        'rating',
    ];


    function user()
    {
        return $this->belongsTo(User::class);
    }

    function comments()
    {
        return $this->hasMany(Comment::class);
    }

    function company()
    {
        return $this->belongsTo(Company::class);
    }

}
