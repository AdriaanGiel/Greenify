<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserProfileTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_profile_tag', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->unsignedInteger('profile_id');
            $table->unsignedInteger('tag_id');


            $table->foreign('profile_id')->references('id')->on('user_profile');
            $table->foreign('tag_id')->references('id')->on('ch_tags');
            $table->index(['profile_id','tag_id']);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_profile_tag');
    }
}
